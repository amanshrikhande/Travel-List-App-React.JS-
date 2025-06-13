import { useState } from "react";
import './App.css';
document.title = "The Travel List";

export default function App() {
  const [items, setItems] = useState([]);
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }
  function handleDeleteItems(id) {
    setItems(item => items.filter(item => item.id !== id));
  }
  function handleToggleItem(id) {
    setItems((items) => items.map((item) => item.id === id ? { ...item, packed: !item.packed } : item
    )
    );
  }
  function handleClear() {
    const confirmed = window.confirm("Are you sure you want to clear?");
    if (confirmed) setItems([]);
  }
  return <div className="app">
    <Logo />
    <Form onAddItems={handleAddItems} />
    <PackingList items={items} onDeleteItem={handleDeleteItems} onToggleItem={handleToggleItem} onClear={handleClear} />
    < Stats items={items} />
  </div>
}

function PackingList({
  items,
  onDeleteItem,
  onToggleItem,
  onClear,
}) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") sortedItems = items;

  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
            key={item.id}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={onClear}>Clear list</button>
      </div>
    </div>
  );
}
function Item({ item, onDeleteItem, onToggleItem }) {
  return <li>
    <input type="checkbox" value={item.packed} onChange={() => onToggleItem(item.id)} />
    <span style={item.packed ? { textDecoration: "line-through" } : {}}>
      {item.quantity} {item.description}
    </span>
    <button onClick={() => onDeleteItem(item.id)}>❌</button>
  </li>;
}
function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding items to your list!</em>
      </p>
    );

  const numItems = items.length;
  const itemsPacked = items.filter((item) => item.packed).length;

  return (
    <footer className="stats">
      <em>
        {itemsPacked === numItems
          ? "You are ready to go! ✈"
          : `${numItems} items on the list, ${itemsPacked} items are packed.`}
      </em>
    </footer>
  );
}

function Logo() {
  return <h1>✈ The Travel List 👜</h1>
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;

    const newItem = {
      description,
      quantity,
      packed: false,
      id: Date.now(),
    };
    onAddItems(newItem);
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Text...."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}
