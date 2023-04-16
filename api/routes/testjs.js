//console.log("hi wissal !!")
function palindrome (str)
{   
    for (i=0;i<=str.length;i++)
    {
      if(str[i] === str[str.length-1-i])
      {
        return true;
      }
      else
      {
        return false;
      }
    }
} 

// take input
const string = prompt('enter string :');

// call the function
const value = palindrome(string);

console.log(value);