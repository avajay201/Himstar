import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const Wallet = ({ navigation }) => {
  const transactions = [
    { id: '1', type: 'Credit', amount: 500, date: '2024-11-01' },
    { id: '2', type: 'Debit', amount: 200, date: '2024-11-02' },
    { id: '3', type: 'Credit', amount: 100, date: '2024-11-03' },
    { id: '4', type: 'Debit', amount: 50, date: '2024-11-04' },
  ];

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDate}>{item.date}</Text>
      <Text style={styles.transactionType}>{item.type}</Text>
      <Text style={styles.transactionAmount}>{item.type === 'Credit' ? '+' : '-'} ₹{item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.walletTitle}>Wallet</Text>
          <Text style={styles.walletBalance}>₹ 1,200</Text>
        </View>
      </View>

      <View style={styles.transactionHistory}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <TouchableOpacity style={styles.withdrawButton}>
        <Text style={styles.withdrawButtonText}>Withdraw</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    backgroundColor: '#B94EA0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 20,
  },
  titleContainer: {
    alignItems: 'center',
  },
  walletTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  walletBalance: {
    fontSize: 20,
    color: '#fff',
    marginTop: 5,
  },
  transactionHistory: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  transactionDate: {
    fontSize: 14,
    color: '#555',
  },
  transactionType: {
    fontSize: 14,
    color: item => (item.type === 'Credit' ? 'green' : 'red'),
  },
  transactionAmount: {
    fontSize: 16,
    color: item => (item.type === 'Credit' ? 'green' : 'red'),
  },
  withdrawButton: {
    backgroundColor: '#B94EA0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  withdrawButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Wallet;
