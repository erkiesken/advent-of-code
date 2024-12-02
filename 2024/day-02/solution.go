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

type Data [][]int

func readInput(filePath string) Data {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))
	lines := strings.Split(content, "\n")
	res := make([][]int, len(lines))
	for i, line := range lines {
		s := []int{}
		parts := strings.Split(line, " ")
		for _, part := range parts {
			n, err := strconv.Atoi(part)
			if err != nil {
				panic(err)
			}
			s = append(s, n)
		}
		res[i] = s
	}

	return res
}

func part1(data Data) {
	sum := 0

	for _, row := range data {
		ok, _ := check(row)
		if ok {
			sum++
		}
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0

	for _, row := range data {
		ok, badIndex := check(row)
		if !ok {
			// try without one item before bad check
			rrow := remove(row, badIndex-1)
			ok, _ = check(rrow)
			if ok {
				sum++
				continue
			}
			// try without the bad check item
			rrow = remove(row, badIndex)
			ok, _ = check(rrow)
			if ok {
				sum++
				continue
			}
			continue
		}

		sum++
	}

	fmt.Printf("Part 2: %v\n", sum)
}

func check(row []int) (bool, int) {
	increasing := true
	if signsum(row) < 0 {
		// more negatives so looks like decreasing
		increasing = false
	}
	for i := 1; i < len(row); i++ {
		this := row[i]
		last := row[i - 1]
		if increasing {
			diff := this - last
			if diff < 1 || diff > 3 || this < last {
				return false, i
			}
		} else {
			diff := last - this
			if diff < 1 || diff > 3 || this > last {
				return false, i
			}
		}
	}
	return true, 0
}

func signsum(numbers []int) int {
	sum := 0
	for i := 1; i < len(numbers); i++ {
		sum += sign(numbers[i] - numbers[i-1])
	}
	return sum
}

func sign(n int) int {
	if n < 0 {
		return -1
	}
	if n > 0 {
		return 1
	}
	return 0
}

func remove(slice []int, index int) []int {
	s := make([]int, len(slice))
	copy(s, slice)
    return append(s[:index], s[index+1:]...)
}
