package main

import (
	"fmt"
	"regexp"
	"strconv"
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

func readInput(filePath string) string {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := string(data)

	return content
}

func part1(data string) {
    re := regexp.MustCompile(`mul\((\d+),(\d+)\)`)
    matches := re.FindAllStringSubmatch(data, -1)
	sum := 0

    for _, match := range matches {
        if len(match) > 2 {
			a := match[1]
			b := match[2]
			aint, _ := strconv.Atoi(a)
			bint, _ := strconv.Atoi(b)
			sum += aint * bint
        }
    }

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data string) {
    re := regexp.MustCompile(`(do\(\)|don't\(\)|mul\((\d+),(\d+)\))`)
    matches := re.FindAllStringSubmatch(data, -1)
	sum := 0
	enabled := true

    for _, match := range matches {
		if match[1] == "don't()" {
			enabled = false
			continue
		}
		if match[1] == "do()" {
			enabled = true
			continue
		}

		if enabled && strings.HasPrefix(match[1], "mul(") && len(match) > 3 {
			a := match[2]
			b := match[3]
			aint, _ := strconv.Atoi(a)
			bint, _ := strconv.Atoi(b)
			sum += aint * bint
        }
    }

	fmt.Printf("Part 2: %v\n", sum)
}
