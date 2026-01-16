import { useState, useEffect, useMemo, useCallback } from "react";
import "./styles.css";

const PAGE_SIZE = 10;

const fetchData = async () => {
  const response = await fetch("https://dummyjson.com/products?limit=200");
  const data = await response.json();
  return data.products ?? [];
};

/*
Products API: https://dummyjson.com/products?limit=200
*/

const Button = ({ text, onClickHandler, isDisable = false }) => {
  return (
    <button className="cta" onClick={onClickHandler} disabled={isDisable}>
      {text}
    </button>
  );
};

const PaginationBar = ({
  currentPage,
  totalCount,
  onLeftClick,
  onRightClick,
  onPageNumberClick,
}) => {
  const pageNumbers = useMemo(() => {
    const range = [];
    for (let i = 1; i <= totalCount; i++) {
      range.push(i);
    }
    return range;
  }, [totalCount]);
  return (
    <div className="action-bar">
      <Button
        text={"<"}
        onClickHandler={onLeftClick}
        isDisable={currentPage === 1}
      />
      {pageNumbers.map((page) => {
        return (
          <button
            className="page-number"
            style={{ backgroundColor: page === currentPage ? "aqua" : "" }}
            key={page}
            onClick={() => onPageNumberClick(page)}
          >
            {page}
          </button>
        );
      })}
      <Button
        text={">"}
        onClickHandler={onRightClick}
        isDisable={currentPage === totalCount}
      />
    </div>
  );
};

const PaginationList = ({ products }) => {
  return (
    <div className="product-list">
      {products.map((product) => {
        const { title, rating, id } = product;
        return (
          <div key={product.id} className="product-card">
            <div>{id}</div>
            <div>{title}</div>
            <div>{rating}</div>
          </div>
        );
      })}
    </div>
  );
};

const PaginationDashboard = () => {
  const [data, setData] = useState([]);
  // const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPage] = useState(0);

  useEffect(() => {
    fetchData()
      .then((res) => {
        setData(res);
        setTotalPage(Math.ceil(res.length / 10));
      })
      .catch(() => {
        console.log("Error in data fetching");
      });
  }, []);

  //Optimised: instead of using a seprate state (since data is already derived)
  const productList = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, currentPage]);

  const onPageNumberClick = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const leftCTACLick = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const rightCTACLick = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  return (
    <div>
      <PaginationBar
        currentPage={currentPage}
        onLeftClick={leftCTACLick}
        onRightClick={rightCTACLick}
        totalCount={totalPages}
        onPageNumberClick={onPageNumberClick}
      />
      <PaginationList products={productList} />
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <h2>Start editing to see some magic happen!</h2>
      <PaginationDashboard />
    </div>
  );
}
