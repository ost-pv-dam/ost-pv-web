import socket


def send_image(host, port):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        client_socket.connect((host, port))
        print(f"Connected to {host}:{port}")

        client_socket.send("0".encode("utf-8"))

        client_socket.send("Hi ESP".encode("utf-8"))
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client_socket.close()  

if __name__ == "__main__":
    host = '18.220.103.162'
    port = 5051
    send_image(host, port)