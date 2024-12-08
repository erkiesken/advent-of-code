package main

import (
	"fmt"
	"strings"
	"slices"
	"os"
)

func main() {
	input := "input.txt"
	if len(os.Args) > 1 {
		input = os.Args[1]
	}

	data := readInput(input)

	part1(data)
	part2(data)
}

type Pos struct {
	Row int
	Col int
}

type Nodes map[Pos]rune
type NodeMap map[rune][]Pos
type Data struct {
	rows int
	cols int
	nodes Nodes
	nodemap NodeMap
}

func readInput(filePath string) Data {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))
	lines := strings.Split(content, "\n")
	nodes := make(Nodes)
	for row, line := range lines {
		for col, c := range line {
			if c != '.' {
				nodes[Pos{Row: row, Col: col}] = c
			}
		}
	}

	nodemap := make(map[rune][]Pos)
	for pos, c := range nodes {
		list, ok := nodemap[c]
		if !ok {
			list = []Pos{}
		}
		nodemap[c] = append(list, pos)
	}
	result := Data{
		rows: len(lines),
		cols: len(lines[0]),
		nodes: nodes,
		nodemap: nodemap,
	}

	return result
}

func part1(data Data) {
	sum := 0

	antinodes := make(map[Pos]bool)
	for _, positions := range data.nodemap {
		pairs := pairwise(positions)
		for _, pair := range pairs {
			offsets := offsets(pair[1], pair[0], data.rows, data.cols, false)
			for _, p := range offsets {
				antinodes[p] = true
			}
		}
	}

	sum = len(antinodes)

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0

	antinodes := make(map[Pos]bool)
	for _, positions := range data.nodemap {
		pairs := pairwise(positions)
		for _, pair := range pairs {
			offsets := offsets(pair[1], pair[0], data.rows, data.cols, true)
			for _, p := range offsets {
				antinodes[p] = true
			}
		}
	}

	sum = len(antinodes)
	fmt.Printf("Part 2: %v\n", sum)
}

func pairwise(list []Pos) [][]Pos {
    var permutations [][]Pos
    for i := 0; i < len(list); i++ {
        for j := i + 1; j < len(list); j++ {
            pair := []Pos{list[i], list[j]}
            permutations = append(permutations, pair)
        }
    }
    return permutations
}

func distances(a, b Pos) []int {
	return []int{a.Row - b.Row, a.Col - b.Col}
}

func offsets(a, b Pos, rows, cols int, repeats bool) []Pos {
	res := []Pos{}
	d := distances(a, b)

	isOutsideBounds := func(p Pos) bool {
		return p.Row < 0 || p.Row >= rows || p.Col < 0 || p.Col >= cols
	}

	if !repeats {
		res = append(res, Pos{Row: b.Row - d[0], Col: b.Col - d[1]})
		res = append(res, Pos{Row: a.Row + d[0], Col: a.Col + d[1]})
	} else {
		// Position b itself
		r := b.Row
		c := b.Col
		p := Pos{Row: r, Col: c}
		res = append(res, p)
		// All extending outwards
		for {
			r -= d[0]
			c -= d[1]
			p = Pos{Row: r, Col: c}
			if isOutsideBounds(p) {
				break
			}
			res = append(res, p)
		}
		// Position a itself
		r = a.Row
		c = a.Col
		p = Pos{Row: r, Col: c}
		res = append(res, p)
		// All extending outwards
		for {
			r += d[0]
			c += d[1]
			p = Pos{Row: r, Col: c}
			if isOutsideBounds(p) {
				break
			}
			res = append(res, p)
		}
	}

	// Filter anything outside of bounds
	res = slices.DeleteFunc(res, isOutsideBounds)
	return res
}
