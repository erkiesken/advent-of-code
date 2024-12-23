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

type Data []int

func readInput(filePath string) Data {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))
	result := []int{}
	for _, part := range strings.Split(content, " ") {
		n, _ := strconv.Atoi(part)
		result = append(result, n)
	}

	return result
}

var BLINKS1 = 25
var BLINKS2 = 75

func part1(data Data) {
	sum := 0

	for i := 1; i <= BLINKS1; i++ {
		data = evolve(data)
	}
	sum = len(data)

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0

	nums := make(map[int]int)

	for _, val := range data {
		v, ok := nums[val]
		if ok {
			nums[val] = v + 1
		} else {
			nums[val] = 1
		}
	}

	for i := 1; i <= BLINKS2; i++ {
		evolve2(nums)
	}

	for _, count := range nums {
		sum += count
	}

	fmt.Printf("Part 2: %v\n", sum)
}

func evolve(data Data) Data {
	result := make(Data, 0)

	for _, num := range data {
		if num == 0 {
			result = append(result, 1)
			continue
		}

		s := strconv.Itoa(num)
		if len(s) % 2 == 0 {
			left, _ := strconv.Atoi(s[:len(s)/2])
			right, _ := strconv.Atoi(s[len(s)/2:])
			result = append(result, left, right)
			continue
		}

		result = append(result, num * 2024)
	}

	return result
}


func evolve2(nums map[int]int) {
	// Make a copy to not mutate while looping
	orig := make(map[int]int)
    for key, value := range nums {
        orig[key] = value
    }

	for num, count := range orig {
		if count == 0 {
			continue
		}
		// Decrease by the count we are dealing with in this round
		nums[num] = nums[num] - count

		result := make([]int, 0)

		s := strconv.Itoa(num)
		if num == 0 {
			result = append(result, 1)
		} else if len(s) % 2 == 0 {
			left, _ := strconv.Atoi(s[:len(s)/2])
			right, _ := strconv.Atoi(s[len(s)/2:])
			result = append(result, left, right)
		} else {
			result = append(result, num * 2024)
		}

		for _, val := range result {
			// Update all the resulting values by count of current number
			nums[val] = nums[val] + count
		}
	}
}
