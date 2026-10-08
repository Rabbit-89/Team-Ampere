import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import ConsumptionChart from "./ConsumptionChart.vue";

const ChartMock = vi.hoisted(() => {
  const mock = vi.fn(function () {
    this.destroy = vi.fn();
  });

  mock.register = vi.fn();

  return mock;
});

vi.mock("chart.js", () => ({
  Chart: ChartMock,
  BarController: {},
  BarElement: {},
  CategoryScale: {},
  LinearScale: {},
  Tooltip: {},
}));

describe("ConsumptionChart", () => {
  it("skickar rätt data till Chart.js", () => {
    mount(ConsumptionChart, {
      props: {
        months: ["Jan", "Feb", "Mar"],
        values: [100, 200, 300],
      },
    });

    expect(ChartMock).toHaveBeenCalled();

    const config = ChartMock.mock.calls[0][1];

    expect(config.data.labels).toEqual(["Jan", "Feb", "Mar"]);

    expect(config.data.datasets[0].data).toEqual([100, 200, 300]);
  });
});
