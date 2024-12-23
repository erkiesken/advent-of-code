package main

import (
	"fmt"
	"math"
	"strings"
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

type Data [][]rune

type Pos struct {
	Row int
	Col int
}

type Plot struct {
	Pos Pos
	Type rune
}

type Bounds struct {
	MinRow int
	MinCol int
	MaxRow int
	MaxCol int
}

type Area map[Pos]rune

func (a Area) Get(row, col int) bool {
	p := Pos{Row: row, Col: col}
	_, ok := a[p]
	return ok
}
func (a Area) MinRow() int {
	m := math.MaxInt
	for p := range a {
		if p.Row < m {
			m = p.Row
		}
	}
	return m
}
func (a Area) MaxRow() int {
	m := math.MinInt
	for p := range a {
		if p.Row > m {
			m = p.Row
		}
	}
	return m
}
func (a Area) MinCol() int {
	m := math.MaxInt
	for p := range a {
		if p.Col < m {
			m = p.Col
		}
	}
	return m
}
func (a Area) MaxCol() int {
	m := math.MinInt
	for p := range a {
		if p.Col > m {
			m = p.Col
		}
	}
	return m
}
func (a Area) Bounds() Bounds {
	return Bounds{
		MaxCol: a.MaxCol(),
		MaxRow: a.MaxRow(),
		MinCol: a.MinCol(),
		MinRow: a.MinRow(),
	}
}
func (a Area) Size() int {
	return len(a)
}
func (a Area) CountLines() int {
	b := a.Bounds()
	sum := 0

	for row := b.MinRow - 1; row <= b.MaxRow; row++ {
		sum += a.ScanRow(row, b)
	}
	for col := b.MinCol - 1; col <= b.MaxCol; col++ {
		sum += a.ScanCol(col, b)
	}

	return sum
}
func (a Area) ScanRow(row int, b Bounds) int {
	sum := 0
	active := false
	// Scan for outside/inside horizontal lines
	for col := b.MinCol - 1; col <= b.MaxCol + 1; col++ {
		up := a.Get(row, col)
		down := a.Get(row+1, col)
		if !up && down {
			active = true
			continue
		}
		if active && !(!up && down) {
			sum++
			active = false
		}
	}
	// Scan for inside/outside horizontal lines
	for col := b.MinCol - 1; col <= b.MaxCol + 1; col++ {
		up := a.Get(row, col)
		down := a.Get(row+1, col)
		if up && !down {
			active = true
			continue
		}
		if active && !(up && !down) {
			sum++
			active = false
		}
	}
	return sum
}
func (a Area) ScanCol(col int, b Bounds) int {
	sum := 0
	active := false
	// Scan for outside/inside vertical lines
	for row := b.MinRow - 1; row <= b.MaxRow + 1; row++ {
		left := a.Get(row, col)
		right := a.Get(row, col+1)
		if !left && right {
			active = true
			continue
		}
		if active && !(!left && right) {
			sum++
			active = false
		}
	}
	// Scan for inside/outside vertical lines
	for row := b.MinRow - 1; row <= b.MaxRow + 1; row++ {
		left := a.Get(row, col)
		right := a.Get(row, col+1)
		if left && !right {
			active = true
			continue
		}
		if active && !(left && !right) {
			sum++
			active = false
		}
	}
	return sum
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

	plots := makePlots(data)
	for _, region := range plots {
		sum += len(region) * fences(data, region)
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0

	plots := makePlots(data)
	for _, region := range plots {
		area := regionToArea(region)
		sum += area.CountLines() * area.Size()
	}
	fmt.Printf("Part 2: %v\n", sum)
}

func makePlots(data Data) [][]Plot {
	plots := [][]Plot{}
	seen := make(map[Pos]bool)

	for row := 0; row < len(data); row++ {
		for col := 0; col < len(data[row]); col++ {
			pos := Pos{Row: row, Col: col}
			region := make([]Plot, 0)
			plot := Plot{Pos: pos, Type: data[row][col]}
			walk(data, plot, &region, seen)
			if len(region) > 0 {
				plots = append(plots, region)
			}
		}
	}
	return plots
}

func regionToArea(region []Plot) Area {
	result := make(Area)
	for _, p := range region {
		result[p.Pos] = p.Type
	}
	return result
}

func walk(data Data, plot Plot, region *[]Plot, seen map[Pos]bool) {
	if _, ok := seen[plot.Pos]; ok {
		// Part of some plot region already
		return
	}
	// Mark as seen
	seen[plot.Pos] = true

	// Collect into connected plot region
	*region = append(*region, plot)

	// Up
	pos := Pos{Row: plot.Pos.Row-1, Col: plot.Pos.Col}
	if get(data, pos.Row, pos.Col) == plot.Type {
		walk(data, Plot{Pos: pos, Type: plot.Type}, region, seen)
	}
	// Right
	pos = Pos{Row: plot.Pos.Row, Col: plot.Pos.Col+1}
	if get(data, pos.Row, pos.Col) == plot.Type {
		walk(data, Plot{Pos: pos, Type: plot.Type}, region, seen)
	}
	// Down
	pos = Pos{Row: plot.Pos.Row+1, Col: plot.Pos.Col}
	if get(data, pos.Row, pos.Col) == plot.Type {
		walk(data, Plot{Pos: pos, Type: plot.Type}, region, seen)
	}
	// Left
	pos = Pos{Row: plot.Pos.Row, Col: plot.Pos.Col-1}
	if get(data, pos.Row, pos.Col) == plot.Type {
		walk(data, Plot{Pos: pos, Type: plot.Type}, region, seen)
	}
}

func fences(data Data, region []Plot) int {
	sum := 0
	for _, plot := range region {
		sum += differentNeighbours(data, plot)
	}
	return sum
}

func differentNeighbours(data Data, plot Plot) int {
	sum := 0
	// Up
	pos := Pos{Row: plot.Pos.Row-1, Col: plot.Pos.Col}
	if get(data, pos.Row, pos.Col) != plot.Type {
		sum++
	}
	// Right
	pos = Pos{Row: plot.Pos.Row, Col: plot.Pos.Col+1}
	if get(data, pos.Row, pos.Col) != plot.Type {
		sum++
	}
	// Down
	pos = Pos{Row: plot.Pos.Row+1, Col: plot.Pos.Col}
	if get(data, pos.Row, pos.Col) != plot.Type {
		sum++
	}
	// Left
	pos = Pos{Row: plot.Pos.Row, Col: plot.Pos.Col-1}
	if get(data, pos.Row, pos.Col) != plot.Type {
		sum++
	}
	return sum
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
