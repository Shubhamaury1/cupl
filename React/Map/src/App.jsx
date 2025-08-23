import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  let foodItems = ["Dal", "Green Vegetable", "Roti", "Salad", "Milk"];
  //mapping
  return (
    <>
      <h1>Healty Food</h1>
      <ul className="list-group">
        {foodItems.map((item) => (
          <li key={item} className="list=group=item">
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

// Conditional Rendering
//   let foodItems = [];
//   let emptyMessage = foodItems.length === 0 ? <h2>I am Hungry</h2> : null;
//   return (
//     <>
//       <h1>Healty Food</h1>
//       {emptyMessage }
//       <ul className="list-group">
//         {foodItems.map((item) => (
//           <li key={item} className="list=group=item">
//             {item}
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }

export default App;
