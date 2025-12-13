package main

import (
	"testing"
)

func TestPart1(t *testing.T) {
	data := readInput("input.test.txt")

	part1(data, 10)
}

func TestPart2(t *testing.T) {
	data := readInput("input.test.txt")

	part2(data)
}
