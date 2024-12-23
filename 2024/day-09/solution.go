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

	data := readInput(input)

	part1(data)
	part2(data)
}

type Data []int

type BlockType int

const (
	Free BlockType = iota
	File
)

type Block struct {
	Type BlockType
	ID int
	Size int
}

func (b Block) Copy() Block {
	return Block{
		Type: b.Type,
		ID: b.ID,
		Size: b.Size,
	}
}

func readInput(filePath string) Data {
    data, err := os.ReadFile(filePath)
    if err != nil {
		panic(err)
    }

    content := strings.TrimSpace(string(data))
	result := make(Data, 0)
	for _, c := range content {
		n, _:= strconv.Atoi(string(c))
		result = append(result, n)
	}

	return result
}

func part1(data Data) {
	sum := 0

	vals := defrag1(makeDisk(data))
	for pos, val := range vals {
		if val > -1 {
			sum += pos * val
		}
	}

	fmt.Printf("Part 1: %v\n", sum)
}

func part2(data Data) {
	disk := defrag2(makeDisk(data))
	sum := checksum(disk)

	fmt.Printf("Part 2: %v\n", sum)
}

func makeDisk(data Data) []Block {
	disk := make([]Block, 0)
	id := 0
	for i, size := range data {
		var b Block
		b.Size = size
		if i % 2 == 0 {
			b.Type = File
            b.ID = id
			id += 1
		} else {
			b.ID = -1
		}
		disk = append(disk, b)
	}
	return disk
}

func defrag1(disk []Block) []int {
	size := 0
	for _, b := range disk {
		size += b.Size
	}
	result := make([]int, size)

	pos := 0
	for _, b := range disk {
		for i := 0; i < b.Size; i++ {
			result[pos] = b.ID
			pos++
		}
	}

	last, end := findRightmostValue(result, len(result))
	for idx, val := range result {
		if val > -1 {
			continue
		}
		result[idx] = last
		result[end]	= -1
		last, end = findRightmostValue(result, end)
		if idx + 2 > end {
			break
		}
	}

	return result
}


func defrag2(disk []Block) []Block {
	moved := make(map[int]bool)

	for i := len(disk)-1; i >= 0; i-- {
		// Go backwards from highest ID
		b := disk[i]
		if b.Type == Free {
			continue
		}
		// Skip if this has been moved already
		if _, ok := moved[b.ID]; ok {
			continue
		}
		// Look for fitting free space up until our pos
		for j := 0; j < i; j++ {
			bf := disk[j]
			if bf.Type != Free {
				continue
			}
			if b.Size > bf.Size {
				// Doesn't fit
				continue
			}
			// Splice out and into correct place
			disk = slices.Delete(disk, i, i+1)
			disk = slices.Insert(disk, j, b)
			// Decrease free space
			disk[j+1] = Block{Type: bf.Type, ID: bf.ID, Size: bf.Size - b.Size}
			// Add placeholder free space where it was
			disk = slices.Insert(disk, i, Block{Type: bf.Type, ID: bf.ID, Size: b.Size})
			moved[b.ID] = true
			break
		}
	}

	return disk
}

func findRightmostValue(s []int, end int) (int, int) {
    for i := end - 1; i >= 0; i-- {
        if s[i] > -1 {
            return s[i], i
        }
    }
    return -1, -1
}

func findLastFileBlock(disk []Block, end int) (Block, int) {
    for i := end - 1; i >= 0; i-- {
        if disk[i].Type == File {
            return disk[i], i
        }
    }
    return Block{}, -1
}

func checksum(disk []Block) int {
	sum := 0
	pos := 0
	for _, b := range disk {
		if b.Type == Free {
			pos += b.Size
			continue
		}
		for i := 0; i < b.Size; i++ {
			sum += pos * b.ID
			pos += 1
		}
	}
	return sum
}

func debugPrint(disk []Block) {
	// fmt.Printf("%+v\n", disk)
	for _, b := range disk {
	   if b.Type == File {
		   fmt.Print(strings.Repeat(strconv.Itoa(b.ID), b.Size))
	   } else {
		   fmt.Print(strings.Repeat(".", b.Size))
	   }
	}
	fmt.Print("\n")
}
