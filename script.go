package main // 1

import ( // 2
	"bufio"   // 3
	"fmt"     // 4
	"os"      // 5
	"strconv" // 6
	"strings" // 7
) // 8

const ( // 9
	rows = 6 // 10
	cols = 7 // 11
) // 12

func main() { // 13
	board := make([][]int, rows) // 14
	for i := range board {       // 15
		board[i] = make([]int, cols) // 16
	} // 17

	turn := 1                           // 18
	moves := 0                          // 19
	reader := bufio.NewReader(os.Stdin) // 20

	for { // 21
		render(board) // 22

		fmt.Printf("Joueur %d, colonne (0-%d): ", turn, cols-1) // 23
		input, _ := reader.ReadString('\n')                     // 24
		input = strings.TrimSpace(input)                        // 25
		col, err := strconv.Atoi(input)                         // 26
		if err != nil || col < 0 || col >= cols {               // 27
			fmt.Println("Entrée invalide") // 28
			continue                       // 29
		} // 30

		row := drop(board, col, turn) // 31
		if row == -1 {                // 32
			fmt.Println("Colonne pleine") // 33
			continue                      // 34
		} // 35

		moves++ // 36

		if win(board, row, col, turn) { // 37
			render(board)                           // 38
			fmt.Printf("Joueur %d gagne !\n", turn) // 39
			break                                   // 40
		} // 41

		if moves >= rows*cols { // 42
			render(board)            // 43
			fmt.Println("Match nul") // 44
			break                    // 45
		} // 46

		turn = 3 - turn // 47
	} // 48
} // 49

func render(board [][]int) { // 50
	fmt.Println()                    // 51
	for r := rows - 1; r >= 0; r-- { // 52
		for c := 0; c < cols; c++ { // 53
			cell := board[r][c] // 54
			if cell == 0 {      // 55
				fmt.Print(". ") // 56
			} else if cell == 1 { // 57
				fmt.Print("X ") // 58
			} else { // 59
				fmt.Print("O ") // 60
			} // 61
		} // 62
		fmt.Println() // 63
	} // 64
	for c := 0; c < cols; c++ { // 65
		fmt.Printf("%d ", c) // 66
	} // 67
	fmt.Println("\n") // 68
} // 69

func drop(board [][]int, col, player int) int { // 70
	for r := 0; r < rows; r++ { // 71
		if board[r][col] == 0 { // 72
			board[r][col] = player // 73
			return r               // 74
		} // 75
	} // 76
	return -1 // 77
} // 78

func win(board [][]int, row, col, player int) bool { // 79
	dirs := [][2]int{{0, 1}, {1, 0}, {1, 1}, {1, -1}} // 80
	for _, d := range dirs {                          // 81
		cnt := 1 + countDir(board, row, col, d[0], d[1], player) + countDir(board, row, col, -d[0], -d[1], player) // 82
		if cnt >= 4 {                                                                                              // 83
			return true // 84
		} // 85
	} // 86
	return false // 87
} // 88

func countDir(board [][]int, row, col, dr, dc, player int) int { // 89
	cnt := 0                                                                // 90
	r := row + dr                                                           // 91
	c := col + dc                                                           // 92
	for r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] == player { // 93
		cnt++   // 94
		r += dr // 95
		c += dc // 96
	} // 97
	return cnt // 98
} // 99
