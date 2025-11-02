// Implements LinkedList, Queue, Stack, and sorting/searching functions.

// Linked List for Patients
class Node {
  constructor(patient) {
    this.patient = patient;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  add(patient) {
    const newNode = new Node(patient);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    let temp = this.head;
    while (temp.next) temp = temp.next;
    temp.next = newNode;
  }

  delete(id) {
    let temp = this.head, prev = null;
    while (temp) {
      if (temp.patient.id == id) {
        if (prev) prev.next = temp.next;
        else this.head = temp.next;
        return temp.patient;
      }
      prev = temp;
      temp = temp.next;
    }
    return null;
  }

  display() {
    const arr = [];
    let temp = this.head;
    while (temp) {
      arr.push(temp.patient);
      temp = temp.next;
    }
    return arr;
  }
}

// Stack (for undo deleted patients)
class Stack {
  constructor() {
    this.items = [];
  }
  push(item) {
    this.items.push(item);
  }
  pop() {
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  display() {
    return [...this.items].reverse();
  }
}

// Queue (for waiting patients)
class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(item) {
    this.items.push(item);
  }
  dequeue() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
  display() {
    return [...this.items];
  }
}

// =================== SORTING ALGORITHMS ===================

function bubbleSortPatients(arr) {
  // Create a copy of the array to avoid changing the original list
  const a = [...arr]; 
  const n = a.length;
  if (n === 0) return a;

  // Define the sorting order
  const urgencyOrder = { High: 1, Medium: 2, Low: 3 };

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      
      // Get the urgency "value" for comparison
      const urgencyA = urgencyOrder[a[j].urgency];
      const urgencyB = urgencyOrder[a[j + 1].urgency];

      // If patient A > patient B, swap them
      if (urgencyA > urgencyB) {
        // Standard swap
        let temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
        swapped = true;
      }
    }
    // If no two elements were swapped by inner loop, then break
    if (swapped == false) break;
  }
  return a; // Return the new sorted array
}