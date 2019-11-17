//
//  ViewController.swift
//  BluetoothSender
//
//  Created by Antonio Antonino on 16/11/19.
//  Copyright © 2019 AntonioAntonino. All rights reserved.
//

import UIKit
import CoreBluetooth

class ViewController: UIViewController {
    
    private var peripheralManager: CBPeripheralManager?
    
    private let tagID = "53247155142391124"
    @IBOutlet weak var receiversFound: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let peripheralQueue: DispatchQueue = DispatchQueue(label: "com.iosbrain.peripheralQueueName", attributes: .concurrent)
        peripheralManager = CBPeripheralManager(delegate: self, queue: peripheralQueue)
        peripheralManager!.delegate = self
    }
    
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        switch peripheralManager!.state {
            
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
            peripheralManager!.startAdvertising([CBAdvertisementDataLocalNameKey: self.tagID, CBAdvertisementDataServiceUUIDsKey: [CBUUID(string: SERVICE_ID)]])
        @unknown default:
            fatalError()
        }
    }
    
    func peripheralManagerDidStartAdvertising(_ peripheral: CBPeripheralManager, error: Error?) {
        print("Peripheral manager started advertising.")
    }
}

extension ViewController: CBPeripheralManagerDelegate {}
