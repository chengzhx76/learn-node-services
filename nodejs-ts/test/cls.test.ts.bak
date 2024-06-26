import { test } from "vitest";

test("cls-test", async () => {
  // const b: B = new B();
  const b: B = {
    x: 1,
    y: 2,
    updateModAndInTime() {
      this.inTime = new Date();
      this.modTime = new Date();
    },),
  };
  b.updateModInTime();
  b.updateModAndInTime();
  console.log(b);
});

abstract class A {
  modTime?: Date;

  inTime?: Date;

  public updateModInTime = function () {
    this.modTime = new Date();
  };
  updateModAndInTime = function () {
    this.inTime = new Date();
    this.modTime = new Date();
  };
}

export class B extends A {
  x: number;
  y: number;
}
