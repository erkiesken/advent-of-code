package main

import (
	"fmt"
	"strings"
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

type Data [][]rune

type Pos struct {
	Row int
	Col int
}

type Guard struct {
	Row int
	Col int
	Dir rune
}

func readInput(filePath string) Data {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))
	lines := strings.Split(content, "\n")
	res := make(Data, len(lines))
	for i, line := range lines {
		parts := strings.Split(line, "")
		s := make([]rune, len(parts))
		for j, part := range parts {
			s[j] = rune(part[0])
		}
		res[i] = s
	}

	return res
}

func part1(data Data) {
	sum := 0

	// Find and reset start
	start := findstart(data)
	data[start.Row][start.Col] = '.'
	guard := Guard{Row: start.Row, Col: start.Col, Dir: '^'}

	visited := make(map[Pos]bool)

	// Mark starting pos
	pos := Pos{Row: guard.Row, Col: guard.Col}
	visited[pos] = true

	for {
		guard = next(data, guard)
		// Check if out of bounds
		if get(data, guard.Row, guard.Col) == '!' {
			break
		}
		pos := Pos{Row: guard.Row, Col: guard.Col}
		visited[pos] = true
	}

	sum = len(visited)

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0

	start := findstart(data)
	data[start.Row][start.Col] = '.'
	guard := Guard{Row: start.Row, Col: start.Col, Dir: '^'}
	guardstart := guard

	visited := make(map[Pos]bool)
	pos := Pos{Row: guard.Row, Col: guard.Col}
	visited[pos] = true

	for {
		nextstep := next(data, guard)

		nextval := get(data, nextstep.Row, nextstep.Col)
		// End if next step is out of bounds
		if nextval == '!' {
			break
		}

		_, seen := visited[Pos{Row: nextstep.Row, Col: nextstep.Col}]

		// Try adding a blocker and detect loop if unseen before next step
		if nextval == '.' && !seen {
			// Add blocker
			data[nextstep.Row][nextstep.Col] = '#'

			if detectloop(data, guardstart, nextstep) {
				sum++
			}

			// Restore
			data[nextstep.Row][nextstep.Col] = '.'
		}

		guard = nextstep
		pos := Pos{Row: guard.Row, Col: guard.Col}
		visited[pos] = true
	}

	fmt.Printf("Part 2: %v\n", sum)
}

func detectloop(data Data, guard Guard, blocker Guard) bool {
	visited := make(map[Guard]bool)
	visited[guard] = true

	for {
		guard = next(data, guard)
		// Check if out of bounds
		if get(data, guard.Row, guard.Col) == '!' {
			return false
		}
		if _, seen := visited[guard]; seen {
			// fmt.Printf("Loop detected: %+v, blocker: %+v\n", guard, blocker)
			// debugprint(data, guard, blocker, visited)
			return true
		}
		visited[guard] = true
	}
}

func debugprint(data Data, guard Guard, blocker Guard, steps map[Guard]bool) {
	visited := make(map[Pos]bool)
	for step := range steps {
		visited[Pos{Row: step.Row, Col: step.Col}] = true
	}
	for row, line := range data {
		for col, c := range line {
			if guard.Row == row && guard.Col == col {
				fmt.Printf("%c", guard.Dir)
			} else if blocker.Row == row && blocker.Col == col {
				fmt.Printf("O")
			} else if visited[Pos{Row: row, Col: col}] {
				fmt.Printf("x")
			} else {
				fmt.Printf("%c", c)
			}
		}
		fmt.Println()
	}
}

func next(data Data, guard Guard) Guard {
	for {
		dir := changedir(data, guard);
		if dir == guard.Dir {
			break
		}
		guard.Dir = dir
	}
	if guard.Dir == '^' {
		guard.Row--
	} else if guard.Dir == '>' {
		guard.Col++
	} else if guard.Dir == 'v' {
		guard.Row++
	} else if guard.Dir == '<' {
		guard.Col--
	}
	return guard
}

func changedir(data Data, guard Guard) rune {
	if (guard.Dir == '^' && get(data, guard.Row - 1, guard.Col) == '#') {
		return '>'
	}
	if (guard.Dir == '>' && get(data, guard.Row, guard.Col + 1) == '#') {
		return 'v'
	}
	if (guard.Dir == 'v' && get(data, guard.Row + 1, guard.Col) == '#') {
		return '<'
	}
	if (guard.Dir == '<' && get(data, guard.Row, guard.Col -1) == '#') {
		return '^'
	}
	return guard.Dir
}

func findstart(data Data) Pos {
	for row, line := range data {
		for col, c := range line {
			if c == '^' {
				return Pos{Row: row, Col: col}
			}
		}
	}
	return Pos{Row: -1, Col: -1}
}

func get(data Data, row, col int) rune {
	if row < 0 || row >= len(data) {
		return '!'
	}
	if col < 0 || col >= len(data[row]) {
		return '!'
	}
	return data[row][col]
}
