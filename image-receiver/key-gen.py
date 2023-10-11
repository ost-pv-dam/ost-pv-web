import secrets
import string

def generate_api_key(key_length=32):
    # Use a combination of letters, digits, and punctuation
    characters = string.ascii_letters + string.digits

    # Generate a secure random API key
    api_key = ''.join(secrets.choice(characters) for _ in range(key_length))

    return api_key

if __name__ == "__main__":
    # You can specify the desired length of the API key
    api_key = generate_api_key()
    print(f"Generated API Key: {api_key}")