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
