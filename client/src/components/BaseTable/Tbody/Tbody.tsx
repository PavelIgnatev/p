import { useStore } from "effector-react";
import { FC, useState, useEffect } from "react";
import CrossIcon from "../../Icon/Cross";
import { $theme } from "../../../store/Theme";
import { Loader } from "../../Loader/Loader";

import classes from "../BaseTable.module.scss";
import { $prevData, setPrevData } from "./prevData";

type TbodyProps = {
  sortedKey: string | null;
  data: Array<Record<string, any>>;
  isReverse: boolean;
  currentPage: number;
  itemsPerPage: number;
};

export const Tbody: FC<TbodyProps> = ({ data, sortedKey, isReverse, currentPage, itemsPerPage }) => {
  const prevData = useStore($prevData);
  const theme = useStore($theme);
  const [sortedData, setSortedData] = useState<Array<Record<string, any>>>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!data || !sortedKey) {
      setSortedData(data || []);
      return;
    }

    setIsSorting(true);

    const sortData = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const sorted = [...data].sort((a, b) => {
        if (!sortedKey) {
          return 0;
        }
        const dataA = String(a[sortedKey] ?? "").toLowerCase();
        const dataB = String(b[sortedKey] ?? "").toLowerCase();

        const numberDataA = Number(dataA);
        const numberDataB = Number(dataB);

        const isNumberDataA = !isNaN(numberDataA);
        const isNumberDataB = !isNaN(numberDataB);

        if (isNumberDataA && isNumberDataB) {
          return isReverse
            ? numberDataB - numberDataA
            : numberDataA - numberDataB;
        }
        if (dataA < dataB) {
          return isReverse ? 1 : -1;
        }
        if (dataA > dataB) {
          return isReverse ? -1 : 1;
        }
        return 0;
      });
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setSortedData(sorted.slice(startIndex, endIndex));
      setIsSorting(false);
    };

    sortData();
  }, [data, sortedKey, isReverse, currentPage, itemsPerPage]);

  const crossClickHandler = async (item: any) => {
    setRemovingId(item["@id"]);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const prevData = JSON.parse(localStorage.getItem("deletedItems") || "[]");
    prevData.push(item["@id"]);
    setPrevData(prevData);
    localStorage.setItem("deletedItems", JSON.stringify(prevData));
    
    setRemovingId(null);
  };

  if (isSorting) {
    return (
      <tbody className={classes.tbody} style={{height: '150px'}}>
        <tr>
          <td colSpan={10} style={{ textAlign: "center", padding: "20px", marginTop: "20px" }}>
            <Loader />
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className={classes.tbody}>
      {sortedData
        .slice(0)
        .filter((item) => !prevData.includes(item["@id"]))
        .map((item, index: number) => {
          const isRemoving = removingId === item["@id"];
          
          return (
            <tr className={classes.tr} key={index}>
              <td
                className={classes.td}
                style={{ backgroundColor: item.color, marginBottom: "1px" }}
              >
                {item["@scheduledStartDate"]}
              </td>
              <td
                className={classes.td}
                style={{ backgroundColor: item.color, marginBottom: "1px" }}
              >
                {item["@lateRegEndDate"] ?? "-"}
              </td>
              <td
                className={classes.td}
                style={{ backgroundColor: item.color, marginBottom: "1px" }}
              >
                {item["@network"]}
              </td>
              <td
                className={classes.td}
                style={{ backgroundColor: item.color, marginBottom: "1px" }}
              >
                {item["@name"]}
              </td>
              <td
                className={classes.td}
                style={{ backgroundColor: item.color, marginBottom: "1px" }}
              >
                {item["@bid"]}
              </td>
              <td
                className={classes.td}
                style={{ backgroundColor: item.color, marginBottom: "1px" }}
              >
                {item["@prizepool"]}
              </td>
              <td
                className={classes.td}
                style={{ backgroundColor: item.color, marginBottom: "1px" }}
              >
                {item["@score"]}
              </td>
              <td
                className={classes.td}
                style={{ backgroundColor: item.color, marginBottom: "1px" }}
              >
                {item["score2"] ?? "-"}
              </td>
              <td
                className={classes.td}
                style={{ backgroundColor: item.color, marginBottom: "1px" }}
              >
                {item["@duration"]}
              </td>
              <td
                className={classes.td}
                style={{ backgroundColor: item.color, marginBottom: "1px" }}
              >
                {isRemoving ? (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ width: "16px", height: "16px" }}>
                      <Loader  style={{ position: 'absolute', left: '50%', top: '50%', marginTop: '-10px', transform: 'scale(0.5) translate(-90%, -65%)'}} />
                    </div>
                  </div>  
                ) : (
                  <CrossIcon onClick={() => crossClickHandler(item)} theme={theme} />
                )}
              </td>
            </tr>
          );
        })}
    </tbody>
  );
};
