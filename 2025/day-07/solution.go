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

	part1(readInput(input))
	part2(readInput(input))
}


type Pos struct {
	X, Y int
}

type Data struct {
	Width, Height int
	Start Pos
	Sources map[Pos]bool
	Splitters map[Pos]bool
}

func readInput(filePath string) Data {
	input, err := os.ReadFile(filePath)
	if err != nil {
		panic(err)
	}

	content := strings.TrimSpace(string(input))
	lines := strings.Split(content, "\n")
	width := len(lines[0])
	height := len(lines)
	sources := make(map[Pos]bool)
	splitters := make(map[Pos]bool)
	start := Pos{}

	for y, line := range lines {
		for x, ch := range line {
			if ch == 'S' {
				start = Pos{X: x, Y: y}
				sources[start] = false
			} else if ch == '^' {
				splitters[Pos{X: x, Y: y}] = false
			}
		}
	}
	
	return Data{
		Width: width,
		Height: height,
		Start: start,
		Sources: sources,
		Splitters: splitters,
	}
}

func part1(data Data) {
	sum := 0

	// fmt.Printf("%+v\n", data)

	for !mapProcessed(data.Sources) {
		for s, processed := range data.Sources {
			if processed {
				continue
			}
			for y := s.Y + 1; y < data.Height; y++ {
				p := Pos{X: s.X, Y: y}
				if mapHas(data.Splitters, p) {
					data.Splitters[p] = true
					left := Pos{X: s.X - 1, Y: y}
					if !mapHas(data.Sources, left) {
						data.Sources[left] = false
					}
					right := Pos{X: s.X + 1, Y: y}
					if !mapHas(data.Sources, right) {
						data.Sources[right] = false
					}
					break
				}
			}
			data.Sources[s] = true
		}
	}

	sum = mapCountTrue(data.Splitters)

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0
	// fmt.Printf("%+v\n", data)

	memo := make(map[Pos]int)

	walk(data.Start, data, memo)
	sum = memo[data.Start]

	fmt.Printf("Part 2: %v\n", sum)
}

func walk(s Pos, data Data, memo map[Pos]int) int {

	// Seen this path already before
	if val, ok := memo[s]; ok {
		return val
	}
		
	for y := s.Y + 1; y < data.Height; y++ {
		p := Pos{X: s.X, Y: y}
		// Hit splitter, try left and right paths
		if mapHas(data.Splitters, p) {
			left := Pos{X: s.X - 1, Y: y}
			right := Pos{X: s.X + 1, Y: y}
			memo[s] = walk(left, data, memo) + walk(right, data, memo)
			return memo[s]
		}
	}

	// Reached the bottom
	return 1
}

func mapHas(m map[Pos]bool, p Pos) bool {
	_, ok := m[p]
	return ok
}

func mapProcessed(m map[Pos]bool) bool {
    for _, processed := range m {
        if !processed {
            return false
        }
    }
    return true
}

func mapCountTrue(m map[Pos]bool) int {
    count := 0
    for _, value := range m {
        if value {
            count++
        }
    }
    return count
}
