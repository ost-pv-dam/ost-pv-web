import socket
import threading

message_available = threading.Condition()
exit_signal = threading.Event()

# Thread to handle each "client_soc" connection
def handler(client_soc, is_device):
    if is_device:
        while not exit_signal.is_set():
            message_available.acquire()
            message_available.wait()
            client_soc.send("Data requested")
    else:
        request = client_soc.recv(1024)
        print(f"Non-device requested: {request}")

        message_available.acquire()
        message_available.notify()
        message_available.release()
        client_soc.close()

with socket.socket() as listening_sock:
    listening_sock.bind(('0.0.0.0', 5051))
    listening_sock.listen()

    try:
        while True:
            client_soc, client_address = listening_sock.accept()
            response = client_soc.recv(1024).decode()
            is_device = False

            if response == '1':
                print("Client {} is a device.".format(client_address))
                is_device = True
            else:
                print("Client {} is not a device.".format(client_address))
            threading.Thread(target=handler,args=(client_soc,is_device), daemon=True).start()
    except KeyboardInterrupt:
        exit_signal.set()