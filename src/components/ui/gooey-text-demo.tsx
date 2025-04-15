import * as React from "react";
import { GooeyText } from "@/components/ui/gooey-text";

function GooeyTextDemo() {
  return (
    <div className="h-[200px] flex items-center justify-center">
      <GooeyText
        texts={["Design", "Engineering", "Is", "Awesome"]}
        morphTime={1}
        cooldownTime={0.25}
        className="font-bold"
      />
    </div>
  );
}

export { GooeyTextDemo };
