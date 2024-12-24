package main

import (
	"fmt"
	"strings"
	"regexp"
	"strconv"
	"math"
	"os"
)

func main() {
	input := "input.txt"
	if len(os.Args) > 1 {
		input = os.Args[1]
	}

	data := readInput(input)

	space := makeSpace(101, 103)

	part1(data, space)
	part2(data, space)
}

type Robot struct {
	X int
	Y int
	DX int
	DY int
}

type Space struct {
	Width int
	Height int
}

type Pos struct {
	X int
	Y int
}

type Locations map[Pos]int

func makeSpace(w, h int) Space {
	return Space{
		Width: w,
		Height: h,
	}
}

func (r *Robot) Move(s Space) {
	x := r.X + r.DX
	y := r.Y + r.DY

	if x < 0 {
		x = s.Width + x
	}
	if x >= s.Width {
		x = x % s.Width
	}
	if y < 0 {
		y = s.Height + y
	}
	if y >= s.Height {
		y = y % s.Height
	}
	r.X = x
	r.Y = y
}

func readInput(filePath string) []Robot {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))
	lines := strings.Split(content, "\n")
	result := make([]Robot, 0)
	for _, line := range lines {
		regex := regexp.MustCompile(
			`p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)`,
		)
		matches := regex.FindStringSubmatch(line)
		x, _ := strconv.Atoi(matches[1])
		y, _ := strconv.Atoi(matches[2])
		dx, _ := strconv.Atoi(matches[3])
		dy, _ := strconv.Atoi(matches[4])

		robot := Robot{
			X: x,
			Y: y,
			DX: dx,
			DY: dy,
		}
		result = append(result, robot)
	}

	return result
}

func part1(robots []Robot, space Space) {
	sum := 0
	loops := 100

	for i := 0; i < loops; i++ {
		for i := range robots {
			robots[i].Move(space)
		}
	}

	sum = quadrants(robots, space)

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(robots []Robot, space Space) {
	total := 0

	loops := 100000

	xs := make([]float64, len(robots))
	ys := make([]float64, len(robots))

	for i := 1; i <= loops; i++ {
		for i := range robots {
			robots[i].Move(space)

			xs[i] = float64(robots[i].X)
			ys[i] = float64(robots[i].Y)
		}

		xdev := standardDeviation(xs)
		ydev := standardDeviation(ys)

		if xdev < 20 && ydev < 20 {
			// fmt.Printf("%d,%f,%f\n", i, xdev, ydev)
			printDebug(robots, space)
			total = i
			break
		}
	}

	fmt.Printf("Part 2: %v\n", total)
}


func robotsToLocations(robots []Robot) Locations {
	result := make(Locations)

	for _, r := range robots {
		p := Pos{X: r.X, Y: r.Y}
		c, ok := result[p]
		if !ok {
			c = 0
		}
		result[p] = c + 1
	}

	return result
}


func (l Locations) GetValue(x, y int) int {
	p := Pos{X: x, Y: y}
	c, ok := l[p]
	if !ok {
		return 0
	}
	return c
}

func (l Locations) Get(x, y int) string {
	p := Pos{X: x, Y: y}
	c, ok := l[p]
	if !ok {
		return "."
	}
	return strconv.Itoa(c)
}


func quadrants(robots []Robot, space Space) int {
	total := 1
	q := 0
	l := robotsToLocations(robots)

	halfWidth := float64(space.Width) / 2
	halfHeight := float64(space.Height) / 2

    q1x1 := 0
    q1x2 := int(math.Floor(halfWidth)) - 1
    q1y1 := 0
    q1y2 := int(math.Floor(halfHeight)) - 1

    q2x1 := int(math.Ceil(halfWidth))
    q2x2 := space.Width - 1
    q2y1 := 0
    q2y2 := int(math.Floor(halfHeight)) - 1

    q3x1 := int(math.Ceil(halfWidth))
    q3x2 := space.Width - 1
    q3y1 := int(math.Ceil(halfHeight))
    q3y2 := space.Height - 1

    q4x1 := 0
    q4x2 := int(math.Floor(halfWidth)) - 1
    q4y1 := int(math.Ceil(halfHeight))
    q4y2 := space.Height - 1

	q = 0
	for x := q1x1; x <= q1x2; x++ {
		for y := q1y1; y <= q1y2; y++ {
			q += l.GetValue(x, y)
		}
	}
	total *= q
	q = 0
	for x := q2x1; x <= q2x2; x++ {
		for y := q2y1; y <= q2y2; y++ {
			q += l.GetValue(x, y)
		}
	}
	total *= q
	q = 0
	for x := q3x1; x <= q3x2; x++ {
		for y := q3y1; y <= q3y2; y++ {
			q += l.GetValue(x, y)
		}
	}
	total *= q
	q = 0
	for x := q4x1; x <= q4x2; x++ {
		for y := q4y1; y <= q4y2; y++ {
			q += l.GetValue(x, y)
		}
	}
	total *= q
	return total
}


func printDebug(robots []Robot, space Space) {
	s := ""
	l := robotsToLocations(robots)

	for y := 0; y < space.Height; y++ {
		for x := 0; x < space.Width; x++ {
			s += l.Get(x, y)
		}
		s += "\n"
	}

	s += "\n"
	fmt.Print(s)
}


func mean(values []float64) float64 {
    var sum float64
    for _, value := range values {
        sum += value
    }
    return sum / float64(len(values))
}

func standardDeviation(values []float64) float64 {
    m := mean(values)
    var varianceSum float64
    for _, value := range values {
        difference := value - m
        varianceSum += difference * difference
    }
    variance := varianceSum / float64(len(values))
    return math.Sqrt(variance)
}
