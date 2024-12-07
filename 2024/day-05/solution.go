package main

import (
	"fmt"
	"strings"
	"strconv"
	"slices"
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

type Rule []int
type Update []int

type Data struct {
	rules []Rule
	updates []Update
}

type RuleMap map[int][]int

func readInput(filePath string) *Data {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))
	parts := strings.Split(content, "\n\n")
	rulelines := strings.Split(parts[0], "\n")
	updatelines := strings.Split(parts[1], "\n")
	rules := make([]Rule, len(rulelines))
	updates := make([]Update, len(updatelines))

	for i, line := range rulelines {
		p := strings.Split(line, "|")
		x, _ := strconv.Atoi(p[0])
		y, _ := strconv.Atoi(p[1])
		rules[i] = []int{x, y}
	}
	for i, line := range updatelines {
		p := strings.Split(line, ",")
		u := make(Update, len(p))
		for j, s := range p {
			x, _ := strconv.Atoi(s)
			u[j] = x
		}
		updates[i] = u
	}

	return &Data{
		rules,
		updates,
	}
}

func part1(data *Data) {
	sum := 0

	outer:
	for _, u := range data.updates {
		for _, rule := range data.rules {
			xpos := slices.Index(u, rule[0])
			ypos := slices.Index(u, rule[1])
			if xpos != -1 && ypos != -1 && xpos > ypos {
				// bad order
				continue outer
			}
		}
		mid := len(u) / 2
		sum += u[mid]
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data *Data) {
	sum := 0

	// Collect bad updates
	badupdates := make([]Update, 0)
	outer:
	for _, u := range data.updates {
		for _, rule := range data.rules {
			xpos := slices.Index(u, rule[0])
			ypos := slices.Index(u, rule[1])
			if xpos != -1 && ypos != -1 && xpos > ypos {
				badupdates = append(badupdates, u)
				continue outer
			}
		}
	}

	rulemap := buildRuleMap(data)

	// Fix by sorting in allowed order
	fixedupdates := make([]Update, len(badupdates))
	for i, u := range badupdates {
		fix := fixUpdate(u, rulemap)
		fixedupdates[i] = fix
	}

	// Find midpoints of fixed updates
	for _, u := range fixedupdates {
		mid := len(u) / 2
		if mid != 0 {
			sum += u[mid]
		}
	}

	fmt.Printf("Part 2: %v\n", sum)
}


func buildRuleMap(data *Data) RuleMap {
	rulemap := make(map[int][]int)

	// Build list of allowed children for each rule
	for _, rule := range data.rules {
		x := rule[0]
		y := rule[1]
		list, ok := rulemap[x];
		if !ok {
			list = []int{}
		}
		list = append(list, y)
		rulemap[x] = list

		list, ok = rulemap[y];
		if !ok {
			list = []int{}
		}
		rulemap[y] = list
	}

	return rulemap
}

func fixUpdate(u Update, rulemap RuleMap) Update {
	result := make(Update, len(u))
	copy(result, u)

	// Sort by looking up which one is in each others allowed child list
	slices.SortStableFunc(result, func(a, b int) int {
		ainb := slices.Index(rulemap[b], a)
		if ainb != -1 {
			return 1
		}
		bina := slices.Index(rulemap[a], b)
		if bina != -1 {
			return -1
		}
		return 0
	})

	return result
}
