package main

import (
	"fmt"
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

func readInput(filePath string) string {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := string(data)

	return content
}

func part1(data string) {
	fmt.Printf("Part 1: %v\n", data)
}

func part2(data string) {
	fmt.Printf("Part 2: %v\n", data)
}
