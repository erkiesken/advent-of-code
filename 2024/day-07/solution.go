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

type Test struct {
	Expected int
	Values []int
}

type Data []Test

func readInput(filePath string) Data {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))

	result := make(Data, 0)

	for _, line := range strings.Split(content, "\n") {
		parts := strings.Split(line, ": ")
		expected, _ := strconv.Atoi(parts[0])
		values := []int{}
		for _, v := range strings.Split(parts[1], " ") {
			value, _ := strconv.Atoi(v)
			values = append(values, value)
		}

		result = append(result, Test{Expected: expected, Values: values})
	}

	return result
}

func part1(data Data) {
	sum := 0
	for _, test := range data {
		if walk1(test.Values, 0, test.Expected) {
			sum += test.Expected
		}
	}
	fmt.Printf("Part 1: %v\n", sum)
}

func walk1(values []int, current int, expected int) bool {
	if len(values) == 0 {
		return current == expected
	}

	value := values[0]
	rest := values[1:]

	if (walk1(rest, current + value, expected)) {
		return true
	} else if (walk1(rest, current * value, expected)) {
		return true
	}

	return false
}

func part2(data Data) {
	sum := 0
	for _, test := range data {
		if test2(test) {
			sum += test.Expected
		}
	}
	fmt.Printf("Part 2: %v\n", sum)
}

func test2(test Test) bool {
	values := test.Values
	first := values[0]
	second := values[1]
	rest := values[2:]

	if walk2(first, '+', second, rest, test.Expected) {
		return true
	}
	if walk2(first, '*', second, rest, test.Expected) {
		return true
	}
	if walk2(first, '|', second, rest, test.Expected) {
		return true
	}
	return false
}

func walk2(current int, op rune, next int, remaining []int, expected int) bool {
	switch op {
	case '+':
		current += next
	case '*':
		current *= next
	case '|':
		current, _ = strconv.Atoi(strconv.Itoa(current) + strconv.Itoa(next))
	}
	if current > expected {
		return false
	}
	if len(remaining) == 0 {
		return current == expected
	}
	next = remaining[0]
	rest := remaining[1:]
	if walk2(current, '+', next, rest, expected) {
		return true
	}
	if walk2(current, '*', next, rest, expected) {
		return true
	}
	if walk2(current, '|', next, rest, expected) {
		return true
	}

	return false
}
