<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Dog.aspx.cs" Inherits="Pet_Store.Dog" %>


<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link href="CSS.css" rel="stylesheet" />
    <title>Pet</title>
    
</head>
<body>
    <form id="form1" runat="server">
    <div  class="content">
          <ul>
                <li><a href="Default.aspx">HOME</a></li>
                <li><a href="Store.aspx">STORE</a></li>
                <li><a href="Owner.aspx">OWNER</a></li>
                <li><a href="Dog.aspx">PET</a></li>
          </ul>
          <div class="pet_div">
         <a href="Dog.aspx"><img class="img1" src="Images/dog.png" width="230" height="230" /></a>
         <a href="Cat.aspx"><img class="img2" src="Images/cat.png" width="250" height="250" /></a>
         <a href="Hamster.aspx"><img class="img3" src="Images/Norman_transparent.png" width="100" height="200" /></a>
               
          
        </div>
        <div class="pet_div1">
             <table class="tabela">
            <tr>
                <td><asp:Label Text="Pet name:" runat="server"></asp:Label></td>
                <td><asp:TextBox ID="name" Width="170px" Font-Size="20px" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td><asp:Label Text="Owner name:" runat="server"></asp:Label></td>
                 <td><asp:DropDownList ID="izborVlasnika" Width="170px" Font-Size="20px" runat="server" DataSourceID="LinqDataSource2" DataTextField="fname" DataValueField="owner_id"></asp:DropDownList>
                <asp:LinqDataSource ID="LinqDataSource2" runat="server" ContextTypeName="Pet_Store.DataClasses1DataContext" EntityTypeName="" TableName="owners"></asp:LinqDataSource></td>
           </tr>
            <tr>
                <td><asp:Label Text="Pet age:" runat="server"></asp:Label></td>
                <td><asp:TextBox ID="age" Width="170px" Font-Size="20px" runat="server" ></asp:TextBox></td>
            </tr>
            <tr>
                <td><asp:Label Text="Description:" runat="server"></asp:Label></td>
                <td><asp:TextBox ID="desc"  TextMode="MultiLine" Width="170px" Font-Size="20px" runat="server" ></asp:TextBox></td>
            </tr>
            <tr>
                <td><asp:Button ID="dodaj" runat="server" Text="Add dog" OnClick="dodaj_Click"/></td>
                <td><asp:Label ID="error" class="greska" runat="server"></asp:Label></td>
            </tr>
             <tr>
                <td><asp:Label Text="Pet name:" runat="server"></asp:Label></td>
                 <td><asp:DropDownList ID="izborLjubimca" Width="170px" Font-Size="20px" AutoPostBack="true" OnSelectedIndexChanged="izborLjubimca_SelectedIndexChanged" OnDataBound="izborLjubimca_SelectedIndexChanged" runat="server" DataSourceID="LinqDataSource1" DataTextField="name" DataValueField="pet_id"></asp:DropDownList>
                <asp:LinqDataSource ID="LinqDataSource1" runat="server" ContextTypeName="Pet_Store.DataClasses1DataContext" EntityTypeName="" TableName="dogs"></asp:LinqDataSource></td>
             </tr>
                 <tr>
                <td><asp:Label Text="Owner:" runat="server"></asp:Label></td>
                 <td><asp:Label  ID="own" runat="server"></asp:Label></td>
             </tr>
            <tr>
                <td><asp:Label   Text="Description:" runat="server"></asp:Label></td>
                <td><asp:TextBox   ID="description" runat="server" Height="100px" TextMode="MultiLine" ></asp:TextBox></td>
           
            </tr>
            <tr>
                <td><asp:Button ID="izmeni" runat="server" Text="Change description" OnClick="izmeni_Click"/></td>
                 <td><asp:Button ID="obrisi" runat="server" Text="Remove pet" OnClick="obrisi_Click"/></td>
            </tr>
            
        </table>
        </div>
    
    
    </div>
    </form>
</body>
</html>
