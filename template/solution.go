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

type Data []string

func readInput(filePath string) Data {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))
	lines := strings.Split(content, "")

	return lines
}

func part1(data Data) {
	sum := 0

	fmt.Printf("%v\n", data)

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0

	fmt.Printf("Part 2: %v\n", sum)
}
