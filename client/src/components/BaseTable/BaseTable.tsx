import { FC, useEffect, useMemo, useState } from "react";
import { Thead } from "./Thead";
import { Tbody } from "./Tbody/Tbody";
import { Loader } from "../Loader/Loader";

import classes from "./BaseTable.module.scss";
import { useStore } from "effector-react";
import { $config } from "../../store/Config";
import { $isProcessing } from "../../store/Table";
import { $prevData } from "./Tbody/prevData";
import { TextTier } from "../TextTier";
import { $goToFirstPageTick } from "./pagination";

type BaseTableProps = {
  data?: Array<Record<string, any>>;
  loading: boolean;
};

export const BaseTable: FC<BaseTableProps> = ({ data, loading }) => {
  const [sortedKey, setSortedKey] = useState<string | null>("@date");
  const [isReverse, setIsReverse] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { networks: fakeNetworks = { ko: {}, freezout: {}, mystery: {} } } =
    useStore($config) ?? {};
  const isProcessing = useStore($isProcessing);
  const goToFirstPageTick = useStore($goToFirstPageTick);
  const prevDeleted = useStore($prevData);

  const levelAndEffmu = useMemo(() => {
    const first = [
      "A",
      "B",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
    ];
    const second = ["C", "B", "A", "SuperA"];

    let minFirstLetter = Infinity;
    let minSecondLetter = Infinity;

    for (let type of Object.keys(fakeNetworks)) {
      const networks = fakeNetworks[type as "ko" | "freezout" | 'mystery'];

      const keys = Object.keys(networks);
      for (let key in keys) {
        const network = keys[key];
        const { level, effmu } = networks[network];

        const firstLetterIndex = first.findIndex(
          (letter) => String(level) === letter
        );
        const secondLetterIndex = second.findIndex(
          (letter) => String(effmu) === letter
        );

        if (firstLetterIndex < minFirstLetter) {
          minFirstLetter = firstLetterIndex;
        }

        if (secondLetterIndex < minSecondLetter) {
          minSecondLetter = secondLetterIndex;
        }
      }
    }

    return `${first[minFirstLetter]}${second[minSecondLetter]}`;
  }, [fakeNetworks]);

  const totalPages = useMemo(() => {
    if (!data) return 0;
    const effectiveLength = data.filter((item) => !prevDeleted.includes(item["@id"]))
      .length;
    return Math.ceil(effectiveLength / itemsPerPage);
  }, [data, prevDeleted]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortedKey, isReverse]);

  useEffect(() => {
    setCurrentPage(1);
  }, [goToFirstPageTick]);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading)
    return (
      <section className={classes.section}>
        <Loader />
      </section>
    );

  if (!data?.length)
    return (
      <section className={classes.nodata}>
        {isProcessing ? "Tournaments are being processed..." : "Nothing found"}
      </section>
    );

  if (!data)
    return (
      <section className={classes.nodata}>
        Select the options you are interested in and click the "Update" button
      </section>
    );

  return (
    <section className={classes.section}>
      <TextTier levelAndEffmu={levelAndEffmu} />
      <div className={classes.tableWrapper}>
        <table id="grid" className={classes.table}>
          <Thead
            setSortedKey={setSortedKey}
            sortedKey={sortedKey}
            setIsReverse={setIsReverse}
            isReverse={isReverse}
          />
          <Tbody 
            data={data}
            sortedKey={sortedKey}
            isReverse={isReverse}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className={classes.pagination}>
          <button 
            onClick={handleFirstPage} 
            disabled={currentPage === 1}
            className={classes.paginationButton}
          >
            First
          </button>
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            className={classes.paginationButton}
          >
            ←
          </button>
          
          {getVisiblePages().map((page, index) => (
            <span key={index}>
              {page === '...' ? (
                <span className={classes.pageDots}>...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  className={`${classes.pageButton} ${currentPage === page ? classes.activePage : ''}`}
                >
                  {page}
                </button>
              )}
            </span>
          ))}
          
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
            className={classes.paginationButton}
          >
            →
          </button>
          <button 
            onClick={handleLastPage} 
            disabled={currentPage === totalPages}
            className={classes.paginationButton}
          >
            Last
          </button>
        </div>
      )}
    </section>
  );
};
