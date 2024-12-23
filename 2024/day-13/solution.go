package main

import (
	"fmt"
	"strings"
	"strconv"
	"regexp"
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

type Move struct {
	X int
	Y int
}
type Pos struct {
	X int
	Y int
}
type Presses struct {
	A int
	B int
}
type Machine struct {
	A Move
	B Move
	Prize Pos
}

func readInput(filePath string) []Machine {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))

	machines := []Machine{}
	for _, m := range strings.Split(content, "\n\n") {
		regex := regexp.MustCompile(
			`Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)`,
		)
		matches := regex.FindStringSubmatch(m)
		ax, _ := strconv.Atoi(matches[1])
		ay, _ := strconv.Atoi(matches[2])
		bx, _ := strconv.Atoi(matches[3])
		by, _ := strconv.Atoi(matches[4])
		px, _ := strconv.Atoi(matches[5])
		py, _ := strconv.Atoi(matches[6])
		machine := Machine{
			A: Move{X: ax, Y: ay},
			B: Move{X: bx, Y: by},
			Prize: Pos{X: px, Y: py},
		}
		machines = append(machines, machine)
	}

	return machines
}

func part1(data []Machine) {
	sum := 0

	for _, m := range data {
		cost := solve1(m)
		if cost == 0 {
			// Failed to solve
			continue
		}
		sum += cost
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data []Machine) {
	sum := 0
	offset := 10000000000000

	for _, m := range data {
		m.Prize.X += offset
		m.Prize.Y += offset
		cost := solve2(m)
		if cost == 0 {
			// Failed to solve
			continue
		}
		sum += cost
	}

	fmt.Printf("Part 2: %v\n", sum)
}


func solve1(m Machine) int {
	solutions := make([]Presses, 0)

	outer:
	for i := 0; i < 100; i++ {
		for j := 0; j < 100; j++ {
			if m.A.X*i + m.B.X*j == m.Prize.X && m.A.Y*i + m.B.Y*j == m.Prize.Y {
				solutions = append(solutions, Presses{A: i, B: j})
				continue outer
			}
			if m.A.X*i + m.B.X*j > m.Prize.X || m.A.Y*i + m.B.Y*j > m.Prize.Y {
				continue outer
			}
		}
	}

	sum := 0
	for _, s := range solutions {
		sum += s.A*3 + s.B*1
	}

	return sum
}

// direct substitutuion solution
func solve2(m Machine) int {
	x0, y0 := m.A.X, m.A.Y
	x1, y1 := m.B.X, m.B.Y
	cx, cy := m.Prize.X, m.Prize.Y

	bDividend := (cy * x0 - cx * y0)
	bDivisor := (y1 * x0 - y0 * x1)

	if bDivisor == 0 {
		// zero division
		return 0
	} else if bDividend % bDivisor != 0 {
		// non-integer solution
		return 0
	}

	b := bDividend / bDivisor
	aDividend := (cx - b * x1)
	aDivisor := x0
	if aDivisor == 0 {
		// zero division
		return 0
	} else if aDividend % aDivisor != 0 {
		// non-integer solution
		return 0
	}
	a := aDividend / aDivisor

	return a * 3 + b * 1
}
