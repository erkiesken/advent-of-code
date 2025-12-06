package main

import (
	"fmt"
	"math"
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

type Batteries []int
type Data []Batteries

func readInput(filePath string) Data {
    input, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(input))
	lines := strings.Split(content, "\n")
	data := make(Data, len(lines))

	for i, line := range lines {
		b := make(Batteries, len(line))
		for j, ch := range line {
			v, err := strconv.Atoi(string(ch))
			if err != nil {
				panic(err)
			}
			b[j] = v
		}
		data[i] = b
	}

	return data
}

func part1(data Data) {
	sum := 0

	for _, batt := range data {
		max := 0
		for i := 0; i < len(batt)-1; i++ {
			tens := 10 * batt[i]
			for j := i + 1; j < len(batt); j++ {
				jolts := tens + batt[j]
				if jolts > max {
					max = jolts
				}
			}
		}
		sum += max
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0
	n := 12
	
	for _, batt := range data {
		combo := make([]int, n)
		leftIdx := 0

		for filling := 0; filling < n; filling++ {
			// set right index to leave enough space for remaining digits
			rightIdx := len(batt) - n + filling + 1
			// find leftmost biggest value and reset left index
			val := 0
			for i := leftIdx; i < rightIdx; i++ {
				if batt[i] > val {
					val = batt[i]
					combo[filling] = val
					leftIdx = i + 1
				}
			}
		}
		max := 0
		for i := 0; i < n; i++ {
			max += int(math.Pow(10, float64(n - i - 1))) * combo[i]
		}
		sum += max
	}

	fmt.Printf("Part 2: %v\n", sum)
}
