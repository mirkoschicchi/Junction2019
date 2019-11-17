//
//  ViewController.swift
//  BluetoothReceiver
//
//  Created by Antonio Antonino on 16/11/19.
//  Copyright © 2019 AntonioAntonino. All rights reserved.
//

import Cocoa
import CoreBluetooth
import Alamofire

class ViewController: NSViewController {
    
    private var centralManager: CBCentralManager?
    private var peripherals: Set<CBPeripheral> = []
    private timer: Timer!
    
    private let receiverID = "a312341313e2"
    
    @IBOutlet weak var luggageLabel: NSTextField! {
        didSet {
            self.luggageLabel.isEditable = false
            self.luggageLabel.isSelectable = false
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let centralQueue: DispatchQueue = DispatchQueue(label: "com.iosbrain.centralQueueName", attributes: .concurrent)
        centralManager = CBCentralManager(delegate: self, queue: centralQueue)
    }

    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        
        switch central.state {
            
        case .unknown:
            print("Bluetooth status is UNKNOWN")
        case .resetting:
            print("Bluetooth status is RESETTING")
        case .unsupported:
            print("Bluetooth status is UNSUPPORTED")
        case .unauthorized:
            print("Bluetooth status is UNAUTHORIZED")
        case .poweredOff:
            print("Bluetooth status is POWERED OFF")
        case .poweredOn:
            print("Bluetooth status is POWERED ON")
            
            centralManager?.scanForPeripherals(withServices: [CBUUID(string: SERVICE_ID)])
        @unknown default:
            fatalError()
        }
        
    }
    
    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        print(peripheral.name)
        decodePeripheralState(peripheralState: peripheral.state)
        peripheral.delegate = self
        
        guard !self.peripherals.contains(peripheral) else {
            return
        }
        centralManager?.connect(peripheral)
        
    }
    
    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        guard let name = peripheral.name else {
            print("Name = nil")
            return
        }
        print("Connected to \(name)")
        var request = URLRequest(url: URL(string: "http://192.168.43.154:9000/update")!)
        request.httpMethod = "POST"
        request.httpBody = "beacon=\(name)&device=\(self.receiverID)&status=true".data(using: String.Encoding.utf8)!
                
        Alamofire.request(request).response { response in
            guard let error = response.error else {
                print(response.response!.statusCode)
                return
            }
            print(error)
        }
        DispatchQueue.main.async {
            self.luggageLabel.stringValue = name
        }
    }
    
    func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
        guard let name = peripheral.name else {
            return
        }
        print("Disconnected from \(name)")
        self.peripherals.remove(peripheral)
        DispatchQueue.main.async {
            self.luggageLabel.stringValue = "No luggage detected"
        }
        var request = URLRequest(url: URL(string: "http://192.168.43.154:9000/update")!)
        request.httpMethod = "POST"
        request.httpBody = "beacon=\(name)&device=\(self.receiverID)&status=false".data(using: String.Encoding.utf8)!
                
        Alamofire.request(request).response { response in
            guard let error = response.error else {
                print(response.response!.statusCode)
                return
            }
            print(error)
        }
        DispatchQueue.main.async {
            self.luggageLabel.stringValue = "No luggage detected"
        }
    }
    
    func decodePeripheralState(peripheralState: CBPeripheralState) {
        
        switch peripheralState {
        case .disconnected:
            print("Peripheral state: disconnected")
        case .connected:
            print("Peripheral state: connected")
        case .connecting:
            print("Peripheral state: connecting")
        case .disconnecting:
            print("Peripheral state: disconnecting")
        @unknown default:
            fatalError()
        }
        
    }
}

extension ViewController: CBCentralManagerDelegate {}

extension ViewController: CBPeripheralDelegate {}
