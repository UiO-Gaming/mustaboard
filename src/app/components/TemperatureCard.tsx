interface TemperatureCardProps {
  temperature: number;
  precipitation: number;
  wind: Map<number, number>;
  fiveHourForecast: Map<string, number>;
}
const TemperatureCard: React.FC<TemperatureCardProps> = ({
  temperature,
  precipitation,
  wind,
  fiveHourForecast,
}) => {
  return (
    <div className="flex flex-col bg-foreground rounded-lg p-3 gap-3">
      {/* two vertical containers */}
      <div className="flex flex-row gap-3">
        {/* left container */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-1 flex-col bg-primary rounded-lg gap-3 p-3 content-center place-content-center">
            <div className="text-headers text-8xl text-center tmp">
              {temperature}°
            </div>
          </div>
          <div className="flex flex-col bg-primary rounded-lg p-3">
            <div className="flex flex-row place-content-between">
              <div className="text-headers text-p para">
                {precipitation + " mm"}
              </div>
              <div className="text-headers text-p para">
                {wind.speed + "(" + wind.gust + ") m/s"}
              </div>
            </div>
          </div>
        </div>

        {/* right container */}
        <div className="flex flex-1 flex-col gap-3">
          {fiveHourForecast.map((item, index) => (
            <div
              key={index}
              className="flex flex-1 flex-col bg-primary rounded-lg gap-3 p-3 place-content-center"
            >
              <div className="flex justify-between content-center">
                <div className="text-headers text-p para">{item.time}</div>
                <div className="text-headers text-p para">{item.temperature}°</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemperatureCard;
