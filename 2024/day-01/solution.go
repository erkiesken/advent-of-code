package main

import (
	"fmt"
	"math"
	"os"
	"slices"
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

type Data struct {
	Left []int
	Right []int
}

func readInput(filePath string) Data {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))
	lines := strings.Split(content, "\n")
	left := make([]int, len(lines))
	right := make([]int, len(lines))
	for n, line := range lines {
		parts := strings.Split(line, "   ")
		l, err := strconv.Atoi(parts[0])
		if err != nil {
			panic(err)
		}
		r, err := strconv.Atoi(parts[1])
		if err != nil {
			panic(err)
		}
		left[n] = l
		right[n] = r
	}

	slices.Sort(left)
	slices.Sort(right)

	return Data{left, right}
}

func dist(a, b int) int {
	return int(math.Abs(float64(a - b)))
}

func part1(data Data) {
	sum := 0

	for i, _ := range data.Left {
		sum += dist(data.Left[i], data.Right[i])
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	occurances := make(map[int]int)
	for _, r := range data.Right {
		occurs, ok := occurances[r]
		if !ok {
			occurs = 1
		} else {
			occurs++
		}
		occurances[r] = occurs
	}

	sum := 0
	for _, l := range data.Left {
		occurs, ok := occurances[l]
		if ok {
			sum += l * occurs
		}
	}

	fmt.Printf("Part 2: %v\n", sum)
}
