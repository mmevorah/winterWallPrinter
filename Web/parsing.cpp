#include <iostream>
#include <algorithm>

using namespace std;


/*	Requires Instr to have same number of integer values
	as the empty pieces array. 
*/
void parse(string instr, int* pieces){	
	int currentIndexOfArray = 0;

	int i = 0;
	int j = 0;
	
	while(j < instr.length()){
		
		if((instr[j] == ' ') || (j == (instr.length() - 1))){
			string numberString = instr.substr(i, j);
			int number = atoi(numberString.c_str());
			pieces[currentIndexOfArray] = number;
			
			currentIndexOfArray++;
			i = j;
		}
		
		j++;
	}
}


int main(){
	
	int pieces[] = {0, 0, 0, 0, 0, 0};
	string h = "23 2 4335 1 234 245";
	parse(h, pieces);


	cout << max(5, 5);

	return 0;
}

