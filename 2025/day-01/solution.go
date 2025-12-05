package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
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

type Data []int

func readInput(filePath string) Data {
    input, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(input))
	content = strings.ReplaceAll(content, "L", "-")
	content = strings.ReplaceAll(content, "R", "")
	lines := strings.Split(content, "\n")
	data := make([]int, len(lines))
	for i, line := range lines {
		num, err := strconv.Atoi(line)
		if err != nil {
			panic(err)
		}
		data[i] = num
	}

	return data
}

func abs(x int) int {
    if x < 0 {
        return -x
    }
    return x
}

func sign(x int) int {
    if x < 0 {
		return -1
    } else if x > 0 {
		return 1
    }
    return 0
}

func norm(x int) int {
	if x < 0 {
		return x + 100
	}
	return x
}

func part1(data Data) {
	loc := 50
	sum := 0

	for _, num := range data {
		// fmt.Printf("%d %d ", loc, num)
		loc = (loc + num) % 100
		if loc < 0 {
			loc += 100
		}
		if loc == 0 {
			sum += 1
		}
		// fmt.Printf("> %d %d\n", loc, num)
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	loc := 50
	sum := 0

	for _, num := range data {
		prev := loc
		// fmt.Printf("%d %d %d\n", sum, loc, num)
		loc += num
		if loc == 0 {
			sum += 1
		} else if sign(loc) != sign(prev) && prev != 0 {
			sum += 1
		}
		sum += abs(loc) / 100
		loc = norm(loc) % 100
		// fmt.Printf("> %d %d %d\n", sum, loc, num)
	}

	fmt.Printf("Part 2: %v\n", sum)
}
