import socket
import time

KEY = "IPQRph00_towrY9jxyFxtw"


def send_message(host, port):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        client_socket.connect((host, port))
        print(f"Connected to {host}:{port}")
        client_socket.send(KEY.encode("utf-8"))
        time.sleep(1)
        client_socket.send((KEY + "POLL").encode("utf-8"))

        while True:
            msg = client_socket.recv(1024)
            print(msg)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client_socket.close()


if __name__ == "__main__":
    host = "3.138.79.216"
    port = 5051
    send_message(host, port)
