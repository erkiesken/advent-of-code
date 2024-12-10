package main

import (
	"fmt"
	"strings"
	"strconv"
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
type PosMap map[Pos]int
type Data[][]int

func readInput(filePath string) Data {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))
	lines := strings.Split(content, "\n")
	result := make(Data, 0)
	for row, line := range lines {
		r := make([]int, len(line))
		result = append(result, r)
		for col, val := range strings.Split(line, "") {
			n, _ := strconv.Atoi(val)
			result[row][col] = n
		}
	}

	return result
}

func part1(data Data) {
	sum := 0

	for row := 0; row < len(data); row++ {
		for col := 0; col < len(data[row]); col++ {
			val := data[row][col]
			// Trails start at 0
			if val != 0 {
				continue
			}
			m := make(PosMap)
			walk(data, val, row, col, m)
			count := len(m)
			sum += count
		}
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func walk(data Data, val, row, col int, posmap PosMap) {
	// Found the peak
	if val == 9 {
		pos := Pos{Row: row, Col: col}
		_, ok := posmap[pos]
		if !ok {
			// A new peak!
			posmap[pos] = 0
		}
		// Increase count of paths to this peak
		posmap[pos] += 1
	}
	var next int
	// Look north
	next = get(data, row-1, col)
	if next - val == 1 {
		walk(data, next, row-1, col, posmap)
	}
	// Look south
	next = get(data, row+1, col)
	if next - val == 1 {
		walk(data, next, row+1, col, posmap)
	}
	// Look west
	next = get(data, row, col-1)
	if next - val == 1 {
		walk(data, next, row, col-1, posmap)
	}
	// Look east
	next = get(data, row, col+1)
	if next - val == 1 {
		walk(data, next, row, col+1, posmap)
	}
}

func part2(data Data) {
	sum := 0

	for row := 0; row < len(data); row++ {
		for col := 0; col < len(data[row]); col++ {
			val := data[row][col]
			// Trails start at 0
			if val != 0 {
				continue
			}
			m := make(PosMap)
			walk(data, val, row, col, m)
			rank := 0
			for _, v := range m {
				rank += v
			}
			sum += rank
		}
	}

	fmt.Printf("Part 2: %v\n", sum)
}

func get(data Data, row, col int) int {
	if row < 0 || row >= len(data) {
		return -1
	}
	if col < 0 || col >= len(data[row]) {
		return -1
	}
	return data[row][col]
}
