package main

import (
	"fmt"
	"strings"
	"strconv"
	"os"
	"unicode"
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

type Operation struct {
	Op string
	Vals []int
	TopdownVals []int
}

type Range struct {
	Op string
	Start, End int
}

type Data []Operation

func readInput(filePath string) Data {
	input, err := os.ReadFile(filePath)
	if err != nil {
		panic(err)
	}

	content := strings.Trim(string(input), "\n")
	lines := strings.Split(content, "\n")
	ops := lines[len(lines)-1]
	table := lines[:len(lines)-1]

	// fmt.Printf("Ops: %v\n", ops)

	ranges := []Range{}
	start := 0
	op := ops[start]
	for i := 0; i < len(ops) - 1; i++ {
		if ops[i+1] != ' ' {
			ranges = append(ranges, Range{Start: start, End: i, Op: string(op)})
			start = i + 1
			op = ops[start]
		}
	}
	ranges = append(ranges, Range{
		Start: start,
		End: len(ops),
		Op: string(op),
	})

	// fmt.Printf("Ranges: %+v\n", ranges)

	data := make(Data, 0)
	for _, r := range ranges {
		values := make([]int, 0)
		for _, line := range table {
			v, err := strconv.Atoi(strings.TrimSpace(line[r.Start:r.End]))
			if err != nil {
				panic(err)
			}
			values = append(values, v)
		}
		tvalues := make([]int, 0)
		for i := r.Start; i < r.End; i++ {
			numstr := ""
			for _, line := range table {
				s := string(line[i])
				if s == " " {
					continue
				}
				numstr += s
			}
			v, err := strconv.Atoi(numstr)
			if err != nil {
				panic(err)
			}
			tvalues = append(tvalues, v)
		}
		data = append(data, Operation{Op: r.Op, Vals: values, TopdownVals: tvalues})
	}

	return data 
}

func part1(data Data) {
	sum := 0

	// fmt.Printf("%+v\n", data)

	for _, op := range data {
		if op.Op == "+" {
			sum += sumSlice(op.Vals)
		} else if op.Op == "*" {
			sum += multiplySlice(op.Vals)
		} else {
			panic("unknown op")
		}
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0

	for _, op := range data {
		if op.Op == "+" {
			sum += sumSlice(op.TopdownVals)
		} else if op.Op == "*" {
			sum += multiplySlice(op.TopdownVals)
		} else {
			panic("unknown op")
		}
	}

	fmt.Printf("Part 2: %v\n", sum)
}

func multiplySlice(s []int) int {
	prod := 1
	for _, v := range s {
		prod *= v
	}
	// fmt.Printf("Product of %v is %v\n", s, prod)
	return prod
}

func sumSlice(s []int) int {
	sum := 0
	for _, v := range s {
		sum += v
	}
	// fmt.Printf("Sum of %v is %v\n", s, sum)
	return sum
}
