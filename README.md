#What?! Another router for React?!
Let's start with React - from official documentation:

>**What is React?**
>
>React is a declarative, efficient, and flexible JavaScript library for building user interfaces.

>**Composition**
>
>The key feature of React is composition of components. Components written by different people should work well together. It is important to us that you can add functionality to a component without causing rippling changes throughout the codebase.

>**Common Abstraction**
>
>We don't want to bloat your apps with useless library code.

>**Stability**
>
>We value API stability.

#So why?
It's true that there are already dozen routers for React. It's sad, but there is not any implementation that respects **React way**: non-bloated, easy to extend, simple yet powerful, stable api.

To learn rrrouter you must know only 3 things:
- Provider
- Router
- Route

_But let's start from beginning..._

#Architecture
![Architecture](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/plandem/rrrouter/master/docs/architecture.puml)

As you can see:

there can have only one Provider with many Routers that can have many Routes.

But let's describe purpose of each component.

| Component      | Description              |
|----------------|--------------------------|
| Provider       | Provides current route information and actions to mutate it. Will notify each Router about changes of current route. Only Routers works directly with Provider. |
| Router         | Groups **Routes** and exposes current route and actions from Provider. Will notify each Route(if condition met) about changes. Any component that wants to get information about current route or mutate it, must use Router for it. |
| Route          | Renders a component or invokes a callback if condition met. |


