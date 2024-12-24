package main

import (
	"testing"
)

func TestPart1(t *testing.T) {
	data := readInput("input.test.txt")

	space := makeSpace(11, 7)

	part1(data, space)
}

func TestPart2(t *testing.T) {
	data := readInput("input.test.txt")

	part2(data)
}
