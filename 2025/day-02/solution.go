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

type Range struct {
	Start, End int
}
type Data []Range

func readInput(filePath string) Data {
    input, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(input))
	lines := strings.Split(content, ",")
	data := make([]Range, len(lines))

	for i, line := range lines {
		parts := strings.Split(line, "-")
		start, err := strconv.Atoi(parts[0])
		if err != nil {
			panic(err)
		}
		end, err := strconv.Atoi(parts[1])
		if err != nil {
			panic(err)
		}
		data[i] = Range{Start: start, End: end}
	}

	return data
}

func repeating(s string) bool {
	l := len(s)
	for i := l/2; i > 0; i-- {
		parts := splitIntoParts(s, i)
		// fmt.Printf("Parts: %v\n", parts)
		allSame := true
		for _, part := range parts {
			if part != parts[0] {
				allSame = false
				break
			}
		}
		if allSame {
			// fmt.Printf("Repeating: %v\n", parts[0])
			return true
		}
	}
	return false
}

func splitIntoParts(s string, length int) []string {
    var parts []string
    n := len(s)
    for i := 0; i < n; i += length {
        end := i + length
        if end > n {
            end = n
        }
        parts = append(parts, string(s[i:end]))
    }
    return parts
}

func part1(data Data) {
	sum := 0

	for _, r := range data {
		for i := r.Start; i <= r.End; i++ {
			s := strconv.Itoa(i)
			l := len(s)
			if l % 2 != 0 {
				continue
			}
			left := s[:l/2]
			right := s[l/2:]
			if left == right {
				sum += i
			}
		}
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0

	for _, r := range data {
		for i := r.Start; i <= r.End; i++ {
			s := strconv.Itoa(i)
			if repeating(s) {
				// fmt.Printf("Found repeating in %v -- %d\n", r, i)
				sum += i
			}
		}
	}

	fmt.Printf("Part 2: %v\n", sum)
}
