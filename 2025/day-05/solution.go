package main

import (
	"fmt"
	"sort"
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

type Range struct {
	Start, End int
}

type Data struct {
	Ranges []Range
	Items []int
}

func readInput(filePath string) Data {
	input, err := os.ReadFile(filePath)
	if err != nil {
		panic(err)
	}

	content := strings.TrimSpace(string(input))
	parts := strings.Split(content, "\n\n")
	ranges := make([]Range, 0)
	for _, line := range strings.Split(parts[0], "\n") {
		val := strings.Split(line, "-")
		start, _ := strconv.Atoi(val[0])
		end, _ := strconv.Atoi(val[1])
		ranges = append(ranges, Range{Start: start, End: end})
	}
	items := make([]int, 0)
	for _, line := range strings.Split(parts[1], "\n") {
		val, _ := strconv.Atoi(line)
		items = append(items, val)
	}

	return Data{
		Ranges: ranges,
		Items: items,
	}
}

func part1(data Data) {
	sum := 0

	// fmt.Printf("%v\n", data)

	for _, item := range data.Items {
		for _, r := range data.Ranges {
			if item >= r.Start && item <= r.End {
				sum += 1
				break
			}
		}
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0

	ranges := data.Ranges
	sort.Slice(data.Ranges, func(i, j int) bool {
		return ranges[i].Start < ranges[j].Start
	})

	i := 0
	for i < len(ranges)-1 {
		current := ranges[i]
		next := ranges[i+1]
		if current.End >= next.Start-1 {
			newRange := Range{
				Start: current.Start,
				End:   max(current.End, next.End),
			}
			ranges[i] = newRange
			ranges = append(ranges[:i+1], ranges[i+2:]...)
		} else {
			i += 1
		}
	}

	for _, r := range ranges {
		sum += r.End - r.Start + 1
	}
		
	// fmt.Printf("%v\n", ranges)

	fmt.Printf("Part 2: %v\n", sum)
}
