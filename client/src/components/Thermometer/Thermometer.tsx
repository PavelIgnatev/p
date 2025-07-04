import * as React from "react";
import { useStore } from "effector-react";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";
import { Box, Typography, styled } from "@mui/material";
import { $colors, handleChangeColors, postColors } from "../../store/Colors";
import "./Thermometer.scss";

const SliderBox = styled(Box)({
  position: "relative",
  width: "500px",
  height: 30,
  marginTop: "35px",
});

const RailStyled = styled("div")({
  position: "absolute",
  width: "100%",
  height: 10,
  borderRadius: 5,
  backgroundColor: "rgb(233,233,233)",
  top: "50%", // Center rail vertically
  transform: "translateY(-50%)",
  pointerEvents: "none", // Prevent clicks on the rail
});

const HandleStyled = styled("div")(({ left }: { left: any }) => ({
  left: `${left}%`,
  position: "absolute",
  marginLeft: "-2px",
  zIndex: 2,
  width: "4px",
  height: "20px",
  backgroundColor: "#2C4870",
  cursor: "pointer",
  top: "50%",
  transform: "translateY(-50%)",
  borderRadius: "10px",
  transition: ".2s transform ease-in-out",
  ":hover": {
    transform: "translateY(-50%) scale(1.15)",
    backgroundColor: "#3a5f94",
  },
}));

const LabelStyled = styled("div")(({ left, index }: {left: any, index: any}) => ({
  left: `${left}%`,
  position: "absolute",
  marginLeft: "-25px",
  width: "50px",
  textAlign: "center",
  fontFamily: "Roboto",
  fontSize: "12px",
  color: "#333",
  top: index % 2 === 0 ? "calc(50% - 17px)" : "calc(50% + 17px)",
  transform: "translateY(-50%)",
}));

const TrackStyled = styled("div")(({ left, width, color }: {left: any, width: any, color: any}) => ({
  position: "absolute",
  height: 10,
  zIndex: 1,
  backgroundColor: color,
  cursor: "pointer",
  left: `${left}%`,
  width: `${width}%`,
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
}));

const EdgeLabel = styled(Typography)({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "12px",
  color: "#333",
});

export const Thermometer: React.FC = () => {
  const domain = [-100, 100];
  const defaultValues = [-50, 0, 50];
  const values = useStore($colors);

  const colors = ["#008000", "#FFFF00", "#FFA500", "#FF0000"];

  const onChange = (newv: number[]) => {
    handleChangeColors(newv);
    postColors({ colors: newv });
  };

  if (!values) {
    return <section className="thermometer-section">Loading...</section>;
  }

  return (
    <section className="thermometer-section">
      <h2 className="thermometer-title">Color section</h2>
      <p className="thermometer-description">
        Selecting a color for the tournament relative to the difference between
        the score and the average score
      </p>
      <SliderBox>
        <EdgeLabel style={{ left: "0%", bottom: "-65px" }}>–100</EdgeLabel>
        <EdgeLabel style={{ right: "0%", bottom: "-65px" }}>100</EdgeLabel>
        <Slider
          mode={2}
          step={1}
          domain={[-100, 100]}
          rootStyle={{ position: "relative", width: "500px" }}
          onChange={(newValues) => onChange(newValues as any)}
          values={values}
        >
          <Rail>
            {({ getRailProps }) => <RailStyled {...getRailProps()} />}
          </Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div>
                {handles.map((handle, index) => (
                  <React.Fragment key={handle.id}>
                    {/* Проверяем, является ли ручка одной из неподвижных */}
                    {handle.value !== -100 && handle.value !== 100 ? (
                      <div>
                        <HandleStyled
                          left={handle.percent}
                          {...getHandleProps(handle.id)}
                        />
                        <LabelStyled left={handle.percent} index={index}>
                          {handle.value}
                        </LabelStyled>
                      </div>
                    ) : (
                      <HandleStyled
                        left={handle.percent}
                        style={{
                          // cursor: "not-allowed",
                          pointerEvents: "none",
                          backgroundColor: "#CCCCCC",
                          opacity: 0,
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </Handles>
          <Tracks left={false} right={false}>
            {({ tracks, getTrackProps }) => (
              <div>
                {tracks.map(({ id, source, target }, index) => (
                  <TrackStyled
                    key={id}
                    left={source.percent}
                    width={target.percent - source.percent}
                    color={colors[index]}
                    {...getTrackProps()}
                  />
                ))}
              </div>
            )}
          </Tracks>
        </Slider>
      </SliderBox>
      <div>
        {[
          { range: `-100<=X<${values[1]}`, color: "green" },
          { range: `${values[1]}<=X<${values[2]}`, color: "yellow" },
          { range: `${values[2]}<=X<${values[3]}`, color: "orange" },
          { range: `${values[3]}<=X<=${values[4]}`, color: "red" },
        ].map((desc) => (
          <p key={desc.range} className="thermometer-rule">
            if {desc.range} then {desc.color}
          </p>
        ))}
      </div>
    </section>
  );
};
