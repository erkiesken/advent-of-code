package main

import (
	"fmt"
	"strings"
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

type Data [][]rune

func readInput(filePath string) Data {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))
	lines := strings.Split(content, "\n")
	res := make(Data, len(lines))
	for i, line := range lines {
		parts := strings.Split(line, "")
		s := make([]rune, len(parts))
		for j, part := range parts {
			s[j] = rune(part[0])
		}
		res[i] = s
	}

	return res
}

func part1(data Data) {
	sum := 0

	words := []string{}
	for row, line := range data {
		for col, c := range line {
			if c == 'X' {
				words = append(words, walkFrom(data, row, col)...)
			}
		}
	}

	for _, word := range words {
		if word == "XMAS" {
			sum++
		}
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0

	for row, line := range data {
		for col, c := range line {
			if c == 'A' && crosses(data, row, col)  {
				sum++
			}
		}
	}

	fmt.Printf("Part 2: %v\n", sum)
}

func walkFrom(data Data, row, col int) []string {
	word := make([]rune, 4)
	res := []string{}

	// right
	for i := 0; i < 4; i++ {
		word[i] = get(data, row, col + i)
	}
	// left
	res = append(res, string(word))
	for i := 0; i < 4; i++ {
		word[i] = get(data, row, col - i)
	}
	// up
	res = append(res, string(word))
	for i := 0; i < 4; i++ {
		word[i] = get(data, row - i, col)
	}
	// down
	res = append(res, string(word))
	for i := 0; i < 4; i++ {
		word[i] = get(data, row + i, col)
	}
	// up-left
	res = append(res, string(word))
	for i := 0; i < 4; i++ {
		word[i] = get(data, row - i, col - i)
	}
	// up-right
	res = append(res, string(word))
	for i := 0; i < 4; i++ {
		word[i] = get(data, row - i, col + i)
	}
	// down-left
	res = append(res, string(word))
	for i := 0; i < 4; i++ {
		word[i] = get(data, row + i, col - i)
	}
	// down-right
	res = append(res, string(word))
	for i := 0; i < 4; i++ {
		word[i] = get(data, row + i, col + i)
	}
	res = append(res, string(word))

	return res
}

func crosses(data Data, row, col int) bool {
	// Get the 4 corners
	tl := get(data, row - 1, col - 1)
	tr := get(data, row - 1, col + 1)
	bl := get(data, row + 1, col - 1)
	br := get(data, row + 1, col + 1)

	// Check if the diagonals are M and S
	d1 := (tl == 'M' && br == 'S') || (tl == 'S' && br == 'M')
	d2 := (tr == 'M' && bl == 'S') || (tr == 'S' && bl == 'M')

	return d1 && d2
}

func get(data Data, row, col int) rune {
	if row < 0 || row >= len(data) {
		return '.'
	}
	if col < 0 || col >= len(data[row]) {
		return '.'
	}
	return data[row][col]
}
