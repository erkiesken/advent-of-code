package main

import (
	"testing"
)

func TestPart1(t *testing.T) {
	data := readInput("input.test.txt")

	part1(data)
}

func TestPart2(t *testing.T) {
	data := readInput("input.test2.txt")

	part2(data)
}
