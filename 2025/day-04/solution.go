package main

import (
	"fmt"
	"strings"
	// "strconv"
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
	X, Y int
}
type Rolls map[Pos]bool
type Data struct {
	Rolls      Rolls
	MaxX, MaxY int
}

func readInput(filePath string) Data {
	input, err := os.ReadFile(filePath)
	if err != nil {
		panic(err)
	}

	content := strings.TrimSpace(string(input))
	lines := strings.Split(content, "\n")
	data := make(map[Pos]bool)

	for y, line := range lines {
		for x, ch := range line {
			if ch == '@' {
				data[Pos{X: x, Y: y}] = true
			}
		}
	}

	return Data{
		Rolls: data,
		MaxX:  len(lines[0]),
		MaxY:  len(lines),
	}
}

func part1(data Data) {
	sum := 0

	// fmt.Printf("%+v\n", data)

	for pos := range data.Rolls {
		around := existingAround(data.Rolls, pos)
		if len(around) < 4 {
			sum += 1
		}
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0

	for {
		removed := []Pos{}
		for pos := range data.Rolls {
			around := existingAround(data.Rolls, pos)
			if len(around) < 4 {
				removed = append(removed, pos)
				sum += 1
			}
		}
		for _, r := range removed {
			delete(data.Rolls, r)
		}
		if 	len(removed) == 0 {
			break
		}
	}

	fmt.Printf("Part 2: %v\n", sum)
}

func mapHas(m Rolls, p Pos) bool {
	_, ok := m[p]
	return ok
}

func existingAround(m Rolls, p Pos) []Pos {
	var positions []Pos
	for _, around := range p.Around() {
		if mapHas(m, around) {
			positions = append(positions, around)
		}
	}
	return positions
}

func (p Pos) Around() []Pos {
	return []Pos{
		{X: p.X - 1, Y: p.Y - 1},
		{X: p.X,     Y: p.Y - 1},
		{X: p.X + 1, Y: p.Y - 1},
		{X: p.X - 1, Y: p.Y},
		{X: p.X + 1, Y: p.Y},
		{X: p.X - 1, Y: p.Y + 1},
		{X: p.X,     Y: p.Y + 1},
		{X: p.X + 1, Y: p.Y + 1},
	}
}
