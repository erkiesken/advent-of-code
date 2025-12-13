package main

import (
	"fmt"
	"math"
	"sort"
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

	part1(data, 1000)
	part2(data)
}

type Data []Vec3

func readInput(filePath string) Data {
	input, err := os.ReadFile(filePath)
	if err != nil {
		panic(err)
	}

	content := strings.TrimSpace(string(input))
	lines := strings.Split(content, "\n")
	data := make(Data, len(lines))

	for i, line := range lines {
		parts := strings.Split(line, ",")
		if len(parts) != 3 {
			panic("invalid line: " + line)
		}
		x, err := strconv.ParseFloat(strings.TrimSpace(parts[0]), 64)
		if err != nil {
			panic(err)
		}
		y, err := strconv.ParseFloat(strings.TrimSpace(parts[1]), 64)
		if err != nil {
			panic(err)
		}
		z, err := strconv.ParseFloat(strings.TrimSpace(parts[2]), 64)
		if err != nil {
			panic(err)
		}
		data[i] = Vec3{X: x, Y: y, Z: z}
	}

	return data
}

func part1(data Data, limit int) {
	sum := 0

	// fmt.Printf("%v\n", data)

	distances := generateDistancePairs(data)
	distances = sortDistancePairs(distances)

	circuits := make(Circuits)
	for _, val := range data {
		s := NewSet()
		s.Add(val)
		circuits[val] = s
	}

	for i, pair := range distances {
		if i >= limit {
			break
		}
		p1 := pair.Point1
		p2 := pair.Point2

		if circuits[p1] == circuits[p2] {
			continue
		}

		s1 := circuits[p1]
		s2 := circuits[p2]
		s1.Join(s2)
		circuits[p1] = s1
		// Reset elements of joined set to point to the new set
		for _, p := range s2.List() {
			circuits[p] = s1
		}
	}

	sizes := []int{}
	for _, set := range circuits.Unique() {
		sizes = append(sizes, set.Size())
	}
	sort.Slice(sizes, func(i, j int) bool {
        return sizes[i] > sizes[j]
    })

	sum = sizes[0] * sizes[1] * sizes[2]

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	sum := 0

	distances := generateDistancePairs(data)
	distances = sortDistancePairs(distances)

	circuits := make(Circuits)
	for _, val := range data {
		s := NewSet()
		s.Add(val)
		circuits[val] = s
	}

	for _, pair := range distances {
		p1 := pair.Point1
		p2 := pair.Point2

		if circuits[p1] == circuits[p2] {
			continue
		}

		s1 := circuits[p1]
		s2 := circuits[p2]
		s1.Join(s2)
		circuits[p1] = s1
		// Reset elements of joined set to point to the new set
		for _, p := range s2.List() {
			circuits[p] = s1
		}

		if circuits.AllSame() {
			sum = int(p1.X * p2.X)
			break
		}
	}

	fmt.Printf("Part 2: %v\n", sum)
}

type Vec3 struct {
    X, Y, Z float64
}

type DistancePair struct {
    Point1, Point2 Vec3
    Distance       float64
}

type Circuits map[Vec3]*Set

func (c Circuits) Unique() []*Set {
	uniqueSets := make(map[*Set]bool)
	for _, set := range c {
		uniqueSets[set] = true
	}
	var sets []*Set
	for set := range uniqueSets {
		sets = append(sets, set)
	}
	return sets
}
func (c Circuits) AllSame() bool {
	uniqueSets := make(map[*Set]bool)
	for _, set := range c {
		uniqueSets[set] = true
	}
	return len(uniqueSets) == 1
}

func (v Vec3) Distance(other Vec3) float64 {
    dx := v.X - other.X
    dy := v.Y - other.Y
    dz := v.Z - other.Z
    return math.Sqrt(dx*dx + dy*dy + dz*dz)
}

func generateDistancePairs(vecs []Vec3) []DistancePair {
    var distancePairs []DistancePair
    for i := 0; i < len(vecs) - 1; i++ {
        for j := i + 1; j < len(vecs); j++ {
			d := vecs[i].Distance(vecs[j])
            distancePairs = append(distancePairs, DistancePair{
				Point1: vecs[i],
				Point2: vecs[j],
				Distance: d,
			})
        }
    }
    return distancePairs
}

func sortDistancePairs(pairs []DistancePair) []DistancePair {
    sort.Slice(pairs, func(i, j int) bool {
        return pairs[i].Distance < pairs[j].Distance
    })
	return pairs
}

type Set struct {
    elements map[Vec3]bool
}
func NewSet() *Set {
    return &Set{elements: make(map[Vec3]bool)}
}
func (s *Set) Add(element Vec3) {
    s.elements[element] = true
}
func (s *Set) Clear() {
	s.elements = make(map[Vec3]bool)
}
func (s *Set) Remove(element Vec3) {
    delete(s.elements, element)
}
func (s *Set) Join(other *Set) {
    for element := range other.elements {
		s.Add(element)
    }
}
func (s *Set) Contains(element Vec3) bool {
    _, exists := s.elements[element]
    return exists
}
func (s *Set) Size() int {
    return len(s.elements)
}
func (s *Set) List() []Vec3 {
    var list []Vec3
    for element := range s.elements {
        list = append(list, element)
    }
    return list
}
