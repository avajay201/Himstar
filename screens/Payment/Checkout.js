import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const Checkout = () => {
  // Static data for checkout details
  const checkoutDetails = {
    totalAmount: "$100.00",
    date: "December 1, 2024",
    competitionName: "Photo Competition 2024",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>Checkout Details</Text>

      {/* Card for displaying details */}
      <View style={styles.card}>
        {/* Total Amount */}
        <View style={styles.detailGroup}>
          <Text style={styles.label}>Total Amount</Text>
          <Text style={styles.detail}>{checkoutDetails.totalAmount}</Text>
        </View>

        {/* Date */}
        <View style={styles.detailGroup}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.detail}>{checkoutDetails.date}</Text>
        </View>

        {/* Competition Name */}
        <View style={styles.detailGroup}>
          <Text style={styles.label}>Competition Name</Text>
          <Text style={styles.detail}>{checkoutDetails.competitionName}</Text>
        </View>

        {/* Name */}
        <View style={styles.detailGroup}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.detail}>{checkoutDetails.name}</Text>
        </View>

        {/* Email */}
        <View style={styles.detailGroup}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.detail}>{checkoutDetails.email}</Text>
        </View>

        {/* Phone */}
        <View style={styles.detailGroup}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.detail}>{checkoutDetails.phone}</Text>
        </View>
      </View>

      {/* Note */}
      <Text style={styles.note}>
        Note: After the payment is done, you will receive a confirmation email.
      </Text>

      {/* Proceed to Checkout Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BD4DA3',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  detailGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#BD4DA3',
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  note: {
    fontSize: 14,
    color: '#BD4DA3',
    marginVertical: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 5,
    marginTop: 10,
    marginBottom: 20,
    width: 300,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B94EA0',
  },
});

export default Checkout;
