import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  isDefault?: boolean;
}

export default function AddressSelectScreen() {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const addresses: Address[] = [
    {
      id: "1",
      label: "Home",
      address: "Times Square NYC, Manhattan",
      city: "New York, NY 10036",
      isDefault: true,
    },
    {
      id: "2",
      label: "My Office",
      address: "5259 Blue Bill Park",
      city: "Pittsburgh, PA 4627",
    },
    {
      id: "3",
      label: "My Apartment",
      address: "21633 Clyde Gallagher",
      city: "Pittsburg, PA 4662",
    },
    {
      id: "4",
      label: "Parent's House",
      address: "6993 Meadow Valley Terra",
      city: "Nashville, TN 36",
    },
    {
      id: "5",
      label: "My Villa",
      address: "6480 Southridge Park",
      city: "Scranton, PA 5670",
    },
  ];

  useEffect(() => {
    loadSelectedAddress();
  }, []);

  const loadSelectedAddress = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem("selectedDeliveryAddress");
      if (savedAddress) {
        const address = JSON.parse(savedAddress);
        setSelectedAddress(address.id);
      } else {
        // Set default to Home if none selected
        setSelectedAddress("1");
      }
    } catch (error) {
      console.error("Error loading address:", error);
      setSelectedAddress("1");
    }
  };

  // ✅ FIXED handleApply function
  const handleApply = async () => {
    const selected = addresses.find((addr) => addr.id === selectedAddress);
    if (!selected) return;

    try {
      await AsyncStorage.setItem("selectedDeliveryAddress", JSON.stringify(selected));
      console.log("✅ Address saved:", selected.label);

      // 🎯 Navigate to Checkout
      router.push("/delivery/checkout");
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Deliver to</Text>
        </TouchableOpacity>
      </View>

      {/* Address List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {addresses.map((address) => (
          <TouchableOpacity key={address.id} style={styles.addressItem} onPress={() => setSelectedAddress(address.id)}>
            <View style={styles.addressLeft}>
              <View style={[styles.locationIcon, selectedAddress === address.id && styles.selectedIcon]}>
                <Text style={styles.locationDot}>📍</Text>
              </View>
              <View style={styles.addressInfo}>
                <View style={styles.labelRow}>
                  <Text style={styles.addressLabel}>{address.label}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText}>{address.address}</Text>
                <Text style={styles.addressCity}>{address.city}</Text>
              </View>
            </View>
            <View style={[styles.radioButton, selectedAddress === address.id && styles.radioButtonSelected]}>
              {selectedAddress === address.id && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Add New Address Button */}
        <TouchableOpacity style={styles.addAddressButton}>
          <Text style={styles.addAddressText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 1,
  },
  addressLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e8f5e8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  selectedIcon: {
    backgroundColor: "#37c667",
  },
  locationDot: {
    fontSize: 16,
    color: "white",
  },
  addressInfo: {
    flex: 1,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: "#37c667",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  defaultText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  addressCity: {
    fontSize: 13,
    color: "#888",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#37c667",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#37c667",
  },
  addAddressButton: {
    backgroundColor: "#e8f5e8",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addAddressText: {
    fontSize: 16,
    color: "#37c667",
    fontWeight: "600",
  },
  footer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  applyButton: {
    backgroundColor: "#37c667",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  applyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
