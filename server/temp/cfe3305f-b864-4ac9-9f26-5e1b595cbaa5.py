print("Hello! This program will take an integer and print it plus one.")
while True:
    try:
        user_input = input("Please enter an integer: ")
        y = int(user_input)
        break  # Exit the loop if input is a valid integer
    except ValueError:
        print(f"'{user_input}' is not a valid integer. Please try again.")

print(f"You entered: {y}")
print(f"Result (y + 1): {y + 1}")