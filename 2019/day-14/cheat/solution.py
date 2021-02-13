import math

def p(x):
	return (int(x.split(" ")[0]), x.split(" ")[1])

def parse(line):
	output = p(line.split(" => ")[1])
	inputs = line.split(" => ")[0].split(",")
	inputs = [p(i.strip()) for i in inputs]
	return (inputs, output)

lines = [parse(line) for line in open("input").read().split("\n")[:-1]]

def requirements(item, quantity, extra):
	if item == 'ORE':
		return quantity
	if item in extra:
		quantity -= extra[item]
	extra[item] = 0
	best = -1
	bestAmtSurplus = -1
	for line in lines:
		if line[1][1] == item:
			effectQuant = int(math.ceil(quantity * 1.0 / line[1][0]))
			surplus = effectQuant * line[1][0] - quantity
			if surplus < 0:
				raise Exception("what")
			if bestAmtSurplus != -1 and bestAmtSurplus != surplus:
				raise Exception("what")
			if bestAmtSurplus == -1:
				bestAmtSurplus = surplus
			s = 0
			for inp in line[0]:
				r = requirements(inp[1], inp[0] * effectQuant, extra)
				s += r
			if best == -1 or s < best:
				best = s
	extra[item] += bestAmtSurplus
	return best

def horribleIncrementalSearch(incrBy, val):
	while True:
		print("trying", val)
		req = requirements('FUEL', val, {})
		print("needs", req)
		if req > 1000000000000:
			return val - incrBy # backtrack
		val += incrBy

meme = 0
for i in range(10, -1, -1):
	incrBy = 10 ** i
	print("Incr by", incrBy)
	meme = horribleIncrementalSearch(incrBy, meme)

print("part2", meme)
print("part1", requirements('FUEL', 1, {}))